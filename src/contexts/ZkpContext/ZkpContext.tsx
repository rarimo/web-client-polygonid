import { config, RELAYER_RELAY_CHAIN_NAMES } from '@config'
import { fetcher, FetcherError } from '@distributedlab/fetcher'
import { Token, type ZKProof } from '@iden3/js-jwz'
import { BigNumber, providers } from 'ethers'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { useWeb3Context } from '@/contexts'
import { ClaimTypes } from '@/contexts/ZkpContext/enums'
import { buildRequestOnChain, getJWZ } from '@/contexts/ZkpContext/helpers'
import { RoutesPaths } from '@/enums'
import { bus, BUS_EVENTS, sleep } from '@/helpers'

interface ZkpContextValue {
  isPending?: boolean

  jwzToken?: Token
  proveRequest: string
  verificationSuccessTx: {
    get: string
    set: (tx: string) => void
  }

  createProveRequest: () => Promise<void>
}

export const zkpContext = createContext<ZkpContextValue>({
  proveRequest: '',
  verificationSuccessTx: {
    get: '',
    set: () => {
      throw new TypeError('verificationSuccessTx is not defined')
    },
  },

  createProveRequest: async () => {
    throw new TypeError('createProveRequest is not defined')
  },
})

type Props = HTMLAttributes<HTMLDivElement>

enum RelayerRelayErrorCodes {
  AlreadyTransited = '3',
  EntryNotFound = '5',
}

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const navigate = useNavigate()

  const [isPending, setIsPending] = useState(false)

  const [jwzToken, setJwzToken] = useState<Token>()
  const [proveRequest, setProveRequest] = useState('')
  const [verificationSuccessTx, setVerificationSuccessTx] = useState<string>('')

  const { provider } = useWeb3Context()

  const validateStateStatusCode = useCallback((statusCode: string) => {
    switch (statusCode) {
      case RelayerRelayErrorCodes.AlreadyTransited:
        return true
      case RelayerRelayErrorCodes.EntryNotFound:
        return false
      default:
        return false
    }
  }, [])

  const isClaimStateValid = useCallback(
    async (claimStateHex: string) => {
      try {
        const { data } = await fetcher.post<{
          tx: string
        }>(`${config.RARIMO_CORE_API_URL}/integrations/relayer/relay`, {
          body: {
            state: claimStateHex,
            chain: RELAYER_RELAY_CHAIN_NAMES[config.DEFAULT_CHAIN],
          },
        })

        const rawProvider = new providers.Web3Provider(
          provider?.rawProvider as providers.ExternalProvider,
        )

        if (!data?.tx) throw new Error('tx is not defined')

        const txReceipt = await rawProvider?.getTransaction(data?.tx)

        await txReceipt?.wait?.()

        return false
      } catch (error) {
        if (!(error instanceof FetcherError)) throw error

        if (!('code' in error.response.data)) throw error

        return validateStateStatusCode(String(error.response.data.code))
      }
    },
    [provider?.rawProvider, validateStateStatusCode],
  )

  const isStateTransitionValid = useCallback(
    async (jwzToken: Token): Promise<boolean> => {
      const zkProofPayload = JSON.parse(jwzToken.getPayload())

      const zkProof = zkProofPayload.body.scope[0] as ZKProof

      const issuerClaimState = zkProof.pub_signals[4]
      const issuerClaimNonRevState = zkProof.pub_signals[6]

      const issuerClaimStateHex = BigNumber.from(issuerClaimState).toHexString()

      const issuerClaimNonRevStateHex = BigNumber.from(
        issuerClaimNonRevState,
      ).toHexString()

      let isIssuerClaimStateHexValid = false
      let isIssuerClaimNonRevStateHexValid = false
      let triesCount = 0

      do {
        isIssuerClaimStateHexValid = await isClaimStateValid(
          issuerClaimStateHex,
        )

        await sleep(500)

        isIssuerClaimNonRevStateHexValid = await isClaimStateValid(
          issuerClaimNonRevStateHex,
        )

        if (!isIssuerClaimStateHexValid && !isIssuerClaimNonRevStateHexValid) {
          await sleep(5_000)
          triesCount++
        }
      } while (
        !isIssuerClaimStateHexValid &&
        !isIssuerClaimNonRevStateHexValid &&
        triesCount < (60_000 * 5) / 5_000
      )

      return isIssuerClaimStateHexValid || isIssuerClaimNonRevStateHexValid
    },
    [isClaimStateValid],
  )

  const startListeningProve = useCallback(
    async (jwt: string, verificationId: string) => {
      let jwz = ''

      do {
        try {
          jwz = await getJWZ(jwt, verificationId)
        } catch (error) {
          /* empty */
        }
        await sleep(3000)
      } while (!jwz)

      const jwzToken = await Token.parse(jwz)
      setJwzToken(jwzToken)

      setIsPending(true)

      if (!(await isStateTransitionValid(jwzToken))) {
        bus.emit(
          BUS_EVENTS.warning,
          `Something wen wrong, looks like you need to regenerate proof, please reload page and try again`,
        )

        return
      }

      navigate(RoutesPaths.authConfirmation)
    },
    [isStateTransitionValid, navigate],
  )

  const createProveRequest = useCallback(async () => {
    const proveRequest = await buildRequestOnChain(
      config.CALLBACK_URL,
      ClaimTypes.KYCAgeCredential,
    )

    setProveRequest(JSON.stringify(proveRequest.request))

    startListeningProve(proveRequest.jwtToken, proveRequest.request.id)
  }, [startListeningProve])

  useEffectOnce(() => {
    if (!jwzToken && !proveRequest && !verificationSuccessTx) {
      navigate(RoutesPaths.app)
    }
  })

  return (
    <zkpContext.Provider
      value={{
        isPending,

        jwzToken,
        proveRequest,

        createProveRequest,

        verificationSuccessTx: {
          get: verificationSuccessTx,
          set: setVerificationSuccessTx,
        },
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
