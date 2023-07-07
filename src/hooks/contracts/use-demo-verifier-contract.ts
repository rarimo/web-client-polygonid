import { Provider } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { DemoVerifier__factory } from '@/types'

export const useDemoVerifierContract = (address?: string) => {
  const { provider } = useWeb3Context()

  const contractInstance = useMemo(() => {
    if (!address || !provider) return undefined

    return provider?.rawProvider
      ? DemoVerifier__factory.connect(
          address,
          provider.rawProvider as unknown as Provider,
        )
      : undefined
  }, [address, provider])

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
