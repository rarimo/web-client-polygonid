import { createContext, FC, HTMLAttributes, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { RoutesPaths } from '@/enums'
import { sleep } from '@/helpers'
import { useMockVerifierContract } from '@/hooks/contracts/use-mock-verifier-contract'

interface ZkpContextValue {
  startListeningProve: (jwt?: string) => Promise<void>
  buildProveRequest: () => Promise<void>
  proveRequest: string
}

export const zkpContext = createContext<ZkpContextValue>({
  startListeningProve: async () => {
    throw new TypeError('startListeningProve is not defined')
  },
  buildProveRequest: async () => {
    throw new TypeError('buildProveRequest is not defined')
  },
  proveRequest: '',
})

type Props = HTMLAttributes<HTMLDivElement>

const claimTypesMap: Record<string, unknown> = {
  KYCAgeCredential: {
    id: 1,
    circuitId: 'credentialAtomicQuerySigV2',
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
  sender: string,
  callbackUrl: string,
) {
  return createAuthorizationRequestWithMessage(reason, '', sender, callbackUrl)
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
      // message: message,
      callbackUrl: callbackUrl,
      scope: [],
    },
  }
}

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const navigate = useNavigate()

  const { provider } = useWeb3Context()

  const { listenVerifiedUsers } = useMockVerifierContract(
    '0x12D0e421d5FFd323b6B71835618D3a5eB17399Fa',
  )

  const [proveRequest, setProveRequest] = useState('')
  const [svcVerificationRequest, setSvcVerificationRequest] = useState<{
    verification_id: string
    jwt: string
  }>()

  const startListeningVerify = useCallback(async () => {
    await listenVerifiedUsers(provider?.address, () => {
      navigate(RoutesPaths.authSuccess)
    })
  }, [listenVerifiedUsers, navigate, provider?.address])

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
        verificationId || svcVerificationRequest?.verification_id

      let jwz = ''

      do {
        try {
          const { data } = await api.get<{
            jwz: string
          }>(`/integrations/verify-proxy/v1/public/verify/response`, {
            query: {
              'request-id': currentVerificationId!,
            },
            headers: {
              Authorization: `Bearer ${currentJwt}`,
            },
          })

          jwz = data.jwz
        } catch (error) {
          /* empty */
        }
        await sleep(7000)
      } while (!jwz)

      console.log(jwz)
    },
    [svcVerificationRequest],
  )

  const buildProveRequest = useCallback(async () => {
    const _svcVerificationRequest = await createVerificationRequest()
    setSvcVerificationRequest(_svcVerificationRequest)

    const authorizationRequest = createAuthorizationRequest(
      'lorem ipsum',
      'did:polygonid:polygon:mumbai:2qDyy1kEo2AYcP3RT4XGea7BtxsY285szg6yP9SPrs',
      `${'https://6998-62-80-164-77.eu.ngrok.io'}/integrations/verify-proxy/v1/public/verify/callback/${
        _svcVerificationRequest.verification_id
      }`,
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

    startListeningProve(_svcVerificationRequest.jwt)
  }, [createVerificationRequest, startListeningProve])

  return (
    <zkpContext.Provider
      value={{
        proveRequest,

        startListeningProve,
        buildProveRequest,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
