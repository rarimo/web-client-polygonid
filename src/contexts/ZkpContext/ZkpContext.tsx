import { Token } from '@iden3/js-jwz'
import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { RoutesPaths } from '@/enums'
import { sleep } from '@/helpers'

interface ZkpContextValue {
  jwzToken?: Token
  startListeningProve: (jwt?: string) => Promise<void>
  createProveRequest: () => Promise<void>
  proveRequest: string
}

const NGROK_URL = 'https://e162-185-143-147-216.eu.ngrok.io'

export const zkpContext = createContext<ZkpContextValue>({
  startListeningProve: async () => {
    throw new TypeError('startListeningProve is not defined')
  },
  createProveRequest: async () => {
    throw new TypeError('createProveRequest is not defined')
  },
  proveRequest: '',
})

type Props = HTMLAttributes<HTMLDivElement>

const claimTypesMap: Record<string, unknown> = {
  KYCAgeCredential: {
    id: 1,
    // FIXME: replace with credentialAtomicQueryMTPV2OnChain
    circuitId: 'credentialAtomicQuerySigV2OnChain',
    query: {
      allowedIssuers: ['*'],
      context:
        'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
      credentialSubject: {
        birthday: {
          $lt: 20000101,
        },
      },
      type: 'KYCAgeCredential',
    },
  },
}

export function createAuthorizationRequest(
  reason: string,
  message: string,
  sender: string,
  callbackUrl: string,
) {
  return createAuthorizationRequestWithMessage(
    reason,
    message,
    sender,
    callbackUrl,
  )
}

export function createAuthorizationRequestWithMessage(
  reason: string,
  message: string,
  sender: string,
  callbackUrl: string,
) {
  const uuid = uuidv4()
  return {
    id: uuid,
    thid: uuid,
    from: sender,
    typ: 'application/iden3comm-plain-json',
    type: 'https://iden3-communication.io/authorization/1.0/request',
    body: {
      reason: reason,
      message: message,
      callbackUrl: callbackUrl,
      scope: [],
    },
  }
}

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const navigate = useNavigate()

  const [jwzToken, setJwzToken] = useState<Token>()
  const [proveRequest, setProveRequest] = useState('')
  const [svcVerificationRequest, setSvcVerificationRequest] = useState<{
    verification_id: string
    jwt: string
  }>()

  const { provider } = useWeb3Context()

  // const startListeningVerify = useCallback(async () => {
  //   await listenVerifiedUsers(provider?.address, () => {
  //     navigate(RoutesPaths.authSuccess)
  //   })
  // }, [listenVerifiedUsers, navigate, provider?.address])

  const createVerificationRequest = useCallback(async (): Promise<{
    verification_id: string
    jwt: string
  }> => {
    const { data } = await api.get<{
      verification_id: string
      jwt: string
    }>('/integrations/verify-proxy/v1/public/verify/request')

    return data
  }, [])

  const startListeningProve = useCallback(
    async (jwt?: string, verificationId?: string) => {
      const currentJwt = jwt || svcVerificationRequest?.jwt
      const currentVerificationId =
        verificationId || svcVerificationRequest?.verification_id || ''

      let jwz = ''

      do {
        try {
          const { data } = await api.get<{
            jwz: string
          }>(
            `/integrations/verify-proxy/v1/public/verify/response/${currentVerificationId}`,
            {
              headers: {
                Authorization: `Bearer ${currentJwt}`,
              },
            },
          )

          jwz = data.jwz
        } catch (error) {
          /* empty */
        }
        await sleep(7000)
      } while (!jwz)

      setJwzToken(await Token.parse(jwz))

      navigate(RoutesPaths.authConfirmation)
    },
    [
      navigate,
      svcVerificationRequest?.jwt,
      svcVerificationRequest?.verification_id,
    ],
  )

  const createProveRequest = useCallback(async () => {
    if (!provider?.address) return

    const _svcVerificationRequest = await createVerificationRequest()
    setSvcVerificationRequest(_svcVerificationRequest)

    const authorizationRequest = createAuthorizationRequest(
      'SBT airdrop',
      String(provider?.address),
      'did:polygonid:polygon:mumbai:2qDpUjL74PwJxkLg1cDhFzCEx8887CNHC3GD91EGny',
      `${NGROK_URL}/integrations/verify-proxy/v1/public/verify/callback/${_svcVerificationRequest.verification_id}`,
    )

    const verifyRequest = {
      ...authorizationRequest,
      id: _svcVerificationRequest.verification_id,
      thid: _svcVerificationRequest.verification_id,
      body: {
        ...authorizationRequest.body,
        scope: [claimTypesMap.KYCAgeCredential],
      },
    }

    setProveRequest(JSON.stringify(verifyRequest))

    startListeningProve(
      _svcVerificationRequest.jwt,
      _svcVerificationRequest.verification_id,
    )
  }, [createVerificationRequest, provider?.address, startListeningProve])

  return (
    <zkpContext.Provider
      value={{
        jwzToken,
        proveRequest,

        startListeningProve,
        createProveRequest,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
