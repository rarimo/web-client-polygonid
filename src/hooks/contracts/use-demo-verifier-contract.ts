import { BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

import { DemoVerifier__factory } from '@/types'

export const useDemoVerifierContract = () => {
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

  return {
    getProveIdentityTxBody,
  }
}
