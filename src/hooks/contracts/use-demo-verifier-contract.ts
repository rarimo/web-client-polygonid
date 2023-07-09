import { DEFAULT_CHAIN, SUPPORTED_CHAINS_DETAILS } from '@config'
import { providers } from 'ethers'
import { useCallback, useMemo } from 'react'

import { ErrorHandler } from '@/helpers'
import { DemoVerifier__factory } from '@/types'

export const useDemoVerifierContract = (address?: string) => {
  const contractInstance = useMemo(() => {
    if (!address) return undefined

    try {
      return DemoVerifier__factory.connect(
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
    (userAddr?: string | null) => {
      const filters = contractInstance?.filters.Verified(null, userAddr, null)

      if (!filters) return

      // const events = contractInstance?.queryFilter(filters)

      contractInstance?.on(filters, res => {
        console.log('Verified', res)
      })
    },
    [contractInstance],
  )

  return {
    listenVerifiedUsers,
  }
}
