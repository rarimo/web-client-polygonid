import { config, RELAYER_RELAY_CHAIN_NAMES } from '@config'
import { Token, type ZKProof } from '@iden3/js-jwz'
import { BigNumber, utils } from 'ethers'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { rarimoCoreApi } from '@/api'
import { ClaimTypes } from '@/contexts/ZkpContext/enums'
import {
  buildRequestOffChain,
  getJWZOffChain,
} from '@/contexts/ZkpContext/helpers'
import { RoutesPaths } from '@/enums'
import { bus, BUS_EVENTS, sleep } from '@/helpers'

interface ZkpContextValue {
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

  const [jwzToken, setJwzToken] = useState<Token>()
  const [proveRequest, setProveRequest] = useState('')
  const [verificationSuccessTx, setVerificationSuccessTx] = useState<string>('')

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
        const { data } = await rarimoCoreApi.post<{
          code: number
          message: string
          details: string[]
        }>(`/integrations/relayer/relay`, {
          body: {
            state: claimStateHex,
            chain: RELAYER_RELAY_CHAIN_NAMES[config.DEFAULT_CHAIN],
          },
        })

        return validateStateStatusCode(String(data.code))
      } catch (error) {
        if (!(error instanceof Error) || !('code' in error)) throw error

        return validateStateStatusCode(String(error.code))
      }
    },
    [validateStateStatusCode],
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

      const isIssuerClaimStateHexValid = await isClaimStateValid(
        issuerClaimStateHex,
      )

      console.log('here 1')

      await sleep(500)

      const isIssuerClaimNonRevStateHexValid = await isClaimStateValid(
        issuerClaimNonRevStateHex,
      )

      console.log('here 2')

      return isIssuerClaimStateHexValid || isIssuerClaimNonRevStateHexValid
    },
    [isClaimStateValid],
  )

  const startListeningProve = useCallback(
    async (jwt: string, verificationId: string) => {
      let jwz = ''

      do {
        try {
          jwz = await getJWZOffChain(jwt, verificationId)
        } catch (error) {
          /* empty */
        }
        await sleep(3000)
      } while (!jwz)

      const jwzToken = await Token.parse(jwz)
      setJwzToken(jwzToken)

      if (!(await isStateTransitionValid(jwzToken))) {
        console.log('in here')
        bus.emit(
          BUS_EVENTS.warning,
          `Something wen wrong, looks like you need to regenerate proof, please reload page and try again`,
        )

        return
      }

      console.log('here')

      navigate(RoutesPaths.authConfirmation)
    },
    [isStateTransitionValid, navigate],
  )

  const createProveRequest = useCallback(async () => {
    const proveRequest = await buildRequestOffChain(
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
