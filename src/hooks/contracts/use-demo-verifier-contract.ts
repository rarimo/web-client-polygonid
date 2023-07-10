import { BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

import { DemoVerifier__factory } from '@/types'

export const useDemoVerifierContract = () => {
  // const contractInstance = useMemo(() => {
  //   if (!address) return undefined
  //
  //   try {
  //     return DemoVerifier__factory.connect(
  //       address,
  //       new providers.JsonRpcProvider(
  //         SUPPORTED_CHAINS_DETAILS[DEFAULT_CHAIN].rpcUrl,
  //       ),
  //     )
  //   } catch (error) {
  //     ErrorHandler.processWithoutFeedback(error)
  //     return undefined
  //   }
  // }, [address])

  const contractInterface = useMemo(
    () => DemoVerifier__factory.createInterface(),
    [],
  )

  const getProveIdentityTxBody = useCallback(
    (
      requestId: BigNumberish,
      inputs_: BigNumberish[],
      a_: [BigNumberish, BigNumberish],
      b_: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c_: [BigNumberish, BigNumberish],
    ) => {
      const data = contractInterface.encodeFunctionData('submitZKPResponse', [
        requestId,
        inputs_,
        a_,
        b_,
        c_,
      ])

      return {
        data,
      }
    },
    [contractInterface],
  )

  // const listenVerifiedUsers = useCallback(
  //   (userAddr?: string | null) => {
  //  const filters = contractInstance?.filters.Verified(null, userAddr, null)
  //
  //     if (!filters) return
  //
  //     // const events = contractInstance?.queryFilter(filters)
  //
  //     contractInstance?.on(filters, res => {
  //       console.log('Verified', res)
  //     })
  //   },
  //   [contractInstance],
  // )

  return {
    getProveIdentityTxBody,
    // listenVerifiedUsers,
  }
}
