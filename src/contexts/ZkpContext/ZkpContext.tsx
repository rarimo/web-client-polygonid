import { config } from '@config'
import { Token } from '@iden3/js-jwz'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ClaimTypes } from '@/contexts/ZkpContext/enums'
import {
  buildRequestOffChain,
  getJWZOffChain,
} from '@/contexts/ZkpContext/helpers'
import { RoutesPaths } from '@/enums'
import { sleep } from '@/helpers'

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

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const navigate = useNavigate()

  const [jwzToken, setJwzToken] = useState<Token>()
  const [proveRequest, setProveRequest] = useState('')
  const [verificationSuccessTx, setVerificationSuccessTx] = useState<string>('')

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

      setJwzToken(await Token.parse(jwz))

      navigate(RoutesPaths.authConfirmation)
    },
    [navigate],
  )

  const createProveRequest = useCallback(async () => {
    const proveRequest = await buildRequestOffChain(
      config.CALLBACK_URL,
      ClaimTypes.KYCAgeCredential,
    )

    setProveRequest(JSON.stringify(proveRequest.request))

    startListeningProve(proveRequest.jwtToken, proveRequest.request.id)
  }, [startListeningProve])

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
