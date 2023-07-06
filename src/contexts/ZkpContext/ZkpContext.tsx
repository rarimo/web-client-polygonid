import { createContext, FC, HTMLAttributes, useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'

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

  const proveRequest = useMemo(
    () => ({
      id: '7f38a193-0918-4a48-9fac-36adfdb8b542',
      typ: 'application/iden3comm-plain-json',
      type: 'https://iden3-communication.io/proofs/1.0/contract-invoke-request',
      thid: '7f38a193-0918-4a48-9fac-36adfdb8b542',
      body: {
        reason: 'airdrop participation',
        transaction_data: {
          contract_address: '0x5E1cf3983DD996BF0299e1C5aF7e6bD2005Ee309',
          method_id: 'b68967e2',
          chain_id: 35443,
          network: 'qtestnet',
        },
        scope: [
          {
            id: 1,
            circuitId: 'credentialAtomicQuerySigV2OnChain',
            query: {
              allowedIssuers: ['*'],
              context:
                'https://raw.githubusercontent.com/omegatymbjiep/schemas/main/json-ld/NaturalPerson.json-ld',
              credentialSubject: {
                isNatural: {
                  $eq: 1,
                },
              },
              type: 'NaturalPerson',
            },
          },
        ],
      },
    }),
    [],
  )

  const startListeningProve = useCallback(async () => {
    // empty
  }, [])

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
