import { createContext, FC, HTMLAttributes, useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { useDemoVerifierContract } from '@/hooks/contracts'

interface ZkpContextValue {
  startListeningProve: () => Promise<void>
  proveRequest: unknown
}

export const zkpContext = createContext<ZkpContextValue>({
  startListeningProve: async () => {
    throw new TypeError('startListeningProve is not defined')
  },
  proveRequest: {},
})

type Props = HTMLAttributes<HTMLDivElement>

const ZkpContextProvider: FC<Props> = ({ children, ...rest }) => {
  const { provider } = useWeb3Context()

  const { listenVerifiedUsers } = useDemoVerifierContract(
    '0x0F08e8EA245E63F2090Bf3fF3772402Da9c047ee',
  )

  const proveRequest = useMemo(
    () => ({
      id: '7f38a193-0918-4a48-9fac-36adfdb8b542',
      typ: 'application/iden3comm-plain-json',
      type: 'https://iden3-communication.io/proofs/1.0/contract-invoke-request',
      thid: '7f38a193-0918-4a48-9fac-36adfdb8b542',
      body: {
        reason: 'airdrop participation',
        transaction_data: {
          contract_address: '0x0F08e8EA245E63F2090Bf3fF3772402Da9c047ee',
          method_id: 'b68967e2',
          chain_id: 80001,
          network: 'mumbai',
        },
        scope: [
          {
            id: 1,
            circuitId: 'credentialAtomicQuerySigV2OnChain',
            query: {
              allowedIssuers: ['*'],
              context:
                'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
              credentialSubject: {
                birthday: {
                  $lt: 20020101,
                },
              },
              type: 'KYCAgeCredential',
            },
          },
        ],
      },
    }),
    [],
  )

  const startListeningProve = useCallback(async () => {
    await listenVerifiedUsers(provider?.address)
  }, [listenVerifiedUsers, provider?.address])

  return (
    <zkpContext.Provider
      value={{
        startListeningProve,
        proveRequest,
      }}
      {...rest}
    >
      {children}
    </zkpContext.Provider>
  )
}

export default ZkpContextProvider
