import { DEFAULT_CHAIN, SUPPORTED_CHAINS_DETAILS } from '@config'
import { Provider } from '@ethersproject/providers'
import { providers } from 'ethers'
import { useCallback, useMemo } from 'react'

import { ErrorHandler } from '@/helpers'
import { MockVerifier__factory } from '@/types'

export const useMockVerifierContract = (address?: string) => {
  const contractInstance = useMemo(() => {
    if (!address) return undefined

    try {
      return MockVerifier__factory.connect(
        address,
        new providers.JsonRpcProvider(
          SUPPORTED_CHAINS_DETAILS[DEFAULT_CHAIN].rpcUrl,
        ),
      )
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      return undefined
    }
  }, [address])

  const listenVerifiedUsers = useCallback(
    (
      userAddr: string | null | undefined,
      callbackFn: (res: unknown) => void,
    ) => {
      const filters = contractInstance?.filters?.[
        'Verified(uint256,address,uint256)'
      ](null, userAddr, null)

      if (!filters) return

      contractInstance?.on(filters, res => {
        callbackFn(res)
      })
    },
    [contractInstance],
  )

  return {
    listenVerifiedUsers,
  }
}
