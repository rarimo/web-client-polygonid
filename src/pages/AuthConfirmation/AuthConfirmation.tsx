import './styles.scss'

import { config, DEFAULT_CHAIN, SUPPORTED_CHAINS } from '@config'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loaderJson from '@/assets/animations/loader.json'
import { Animation, AppButton, Icon } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { BasicSelectField } from '@/fields'
import { ErrorHandler, sleep } from '@/helpers'
import { useDemoVerifierContract } from '@/hooks/contracts'

type Props = HTMLAttributes<HTMLDivElement>

type ChainToPublish = {
  title: string
  value: string
  iconName: ICON_NAMES
}

const AuthConfirmation: FC<Props> = () => {
  const navigate = useNavigate()

  const { jwzToken } = useZkpContext()
  const { provider } = useWeb3Context()
  const { getProveIdentityTxBody } = useDemoVerifierContract()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const CHAINS_DETAILS_MAP = useMemo<Record<SUPPORTED_CHAINS, ChainToPublish>>(
    () => ({
      [SUPPORTED_CHAINS.POLYGON]: {
        title: 'Polygon chain',
        value: SUPPORTED_CHAINS.POLYGON,
        iconName: ICON_NAMES.polygon,
      },
      [SUPPORTED_CHAINS.POLYGON_TESTNET]: {
        title: 'Polygon testnet chain',
        value: SUPPORTED_CHAINS.POLYGON_TESTNET,
        iconName: ICON_NAMES.polygon,
      },
      [SUPPORTED_CHAINS.SEPOLIA]: {
        title: 'Sepolia chain',
        value: SUPPORTED_CHAINS.SEPOLIA,
        iconName: ICON_NAMES.ethereum,
      },
      [SUPPORTED_CHAINS.GOERLI]: {
        title: 'Goerli chain',
        value: SUPPORTED_CHAINS.GOERLI,
        iconName: ICON_NAMES.ethereum,
      },
    }),
    [],
  )

  const [selectedChainToPublish, setSelectedChainToPublish] =
    useState<SUPPORTED_CHAINS>(DEFAULT_CHAIN)

  const submitZkp = useCallback(async () => {
    setIsSubmitting(true)

    try {
      if (!jwzToken) throw new TypeError('ZKP is not defined')

      const txBody = getProveIdentityTxBody(
        '1',
        jwzToken.zkProof.pub_signals.map(el => BigInt(el)),
        [jwzToken.zkProof.proof.pi_a[0], jwzToken.zkProof.proof.pi_a[1]],
        [
          [
            jwzToken.zkProof.proof.pi_b[0][1],
            jwzToken.zkProof.proof.pi_b[0][0],
          ],
          [
            jwzToken.zkProof.proof.pi_b[1][1],
            jwzToken.zkProof.proof.pi_b[1][0],
          ],
        ],
        [jwzToken.zkProof.proof.pi_c[0], jwzToken.zkProof.proof.pi_c[1]],
      )

      await provider?.signAndSendTx({
        to: config?.[
          `DEMO_VERIFIER_CONTRACT_ADDRESS_${selectedChainToPublish}`
        ],
        ...txBody,
      })

      // FIXME: remove
      await sleep(3000)

      navigate(RoutesPaths.authSuccess)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsSubmitting(false)
  }, [
    getProveIdentityTxBody,
    jwzToken,
    navigate,
    provider,
    selectedChainToPublish,
  ])

  return (
    <div className='auth-confirmation'>
      <div className='auth-confirmation__header'>
        <div className='auth-confirmation__header-icon-wrp'>
          <Icon
            className='auth-confirmation__header-icon'
            name={ICON_NAMES.check}
          />
        </div>
        <h2 className='auth-confirmation__header-title'>{`Proof Generated`}</h2>
        <span className='auth-confirmation__header-subtitle'>
          {`Proof is generated using Zero-Knowledge Proof (ZKP) and none of the personal info is shared with any party`}
        </span>
      </div>

      {isSubmitting ? (
        <Animation source={loaderJson} />
      ) : (
        <div className='auth-confirmation__card'>
          <div className='auth-confirmation__card-header'>
            <h5 className='auth-confirmation__card-title'>
              {`Make it available on any chain`}
            </h5>
            <span className='auth-confirmation__card-subtitle'>
              {`Your proof has been published on Polygon as default`}
            </span>
          </div>

          <div className='auth-confirmation__chains'>
            <div className='auth-confirmation__chain-item '>
              <BasicSelectField
                label={`Select chain`}
                value={String(selectedChainToPublish)}
                updateValue={value =>
                  setSelectedChainToPublish(value as SUPPORTED_CHAINS)
                }
                valueOptions={
                  Object.values(SUPPORTED_CHAINS)?.map?.(el => ({
                    title: CHAINS_DETAILS_MAP[el].title,
                    value: el,
                    iconName: CHAINS_DETAILS_MAP[el].iconName,
                  })) ?? []
                }
              />
            </div>
          </div>

          <div className='auth-confirmation__divider' />

          <AppButton
            className='auth-confirmation__submit-btn'
            text={`SUBMIT PROOF`}
            iconRight={ICON_NAMES.arrowRight}
            size='large'
            onClick={submitZkp}
          />
        </div>
      )}
    </div>
  )
}

export default AuthConfirmation
