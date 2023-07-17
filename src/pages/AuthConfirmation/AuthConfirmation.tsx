import './styles.scss'

import { config, SUPPORTED_CHAINS, SUPPORTED_CHAINS_DETAILS } from '@config'
import {
  errors,
  type EthTransactionResponse,
  PROVIDERS,
} from '@distributedlab/w3p'
import { ZKProof } from '@iden3/js-jwz'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loaderJson from '@/assets/animations/loader.json'
import { Animation, AppButton, Icon } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useDemoVerifierContract } from '@/hooks/contracts'

type Props = HTMLAttributes<HTMLDivElement>

type ChainToPublish = {
  title: string
  value: string
  iconName: ICON_NAMES
}

const AuthConfirmation: FC<Props> = () => {
  const navigate = useNavigate()

  const { jwzToken, verificationSuccessTx } = useZkpContext()
  const { provider, init } = useWeb3Context()
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
    }),
    [],
  )

  const selectedChainToPublish = useMemo(
    () => SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
    [],
  )

  const submitZkp = useCallback(async () => {
    setIsSubmitting(true)

    try {
      if (!jwzToken) throw new TypeError('ZKP is not defined')

      const zkProofPayload = JSON.parse(jwzToken.getPayload())

      const zkProof = zkProofPayload.body.scope[0] as ZKProof

      const txBody = getProveIdentityTxBody(
        '1',
        zkProof.pub_signals.map(el => BigInt(el)),
        [zkProof.proof.pi_a[0], zkProof.proof.pi_a[1]],
        [
          [zkProof.proof.pi_b[0][1], zkProof.proof.pi_b[0][0]],
          [zkProof.proof.pi_b[1][1], zkProof.proof.pi_b[1][0]],
        ],
        [zkProof.proof.pi_c[0], zkProof.proof.pi_c[1]],
      )

      const tx = await provider?.signAndSendTx?.({
        to: config?.[`DEMO_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`],
        ...txBody,
      })

      verificationSuccessTx.set((tx as EthTransactionResponse).transactionHash)

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
    verificationSuccessTx,
  ])

  const providerChainId = useMemo(() => provider?.chainId, [provider?.chainId])

  const isProviderValidChain = useMemo(() => {
    if (!providerChainId) return false

    return +providerChainId === +selectedChainToPublish.id
  }, [providerChainId, selectedChainToPublish.id])

  const connectWallet = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [init])

  const tryAddChain = useCallback(async () => {
    try {
      await provider?.addChain?.(selectedChainToPublish)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [provider, selectedChainToPublish])

  const trySwitchChain = useCallback(async () => {
    try {
      await provider?.switchChain?.(Number(selectedChainToPublish.id))
    } catch (error) {
      if (error instanceof errors.ProviderChainNotFoundError) {
        await tryAddChain()
      } else {
        ErrorHandler.process(error)
      }
    }
  }, [provider, selectedChainToPublish, tryAddChain])

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
          <div className='auth-confirmation__chain-preview'>
            <div className='auth-confirmation__chain-preview-icon-wrp'>
              <Icon
                className='auth-confirmation__chain-preview-icon'
                name={CHAINS_DETAILS_MAP[config.DEFAULT_CHAIN].iconName}
              />
            </div>

            <span className='auth-confirmation__chain-preview-title'>
              {`Your proof will be submitted on ${
                CHAINS_DETAILS_MAP[config.DEFAULT_CHAIN].title
              }`}
            </span>
          </div>

          {provider?.isConnected ? (
            isProviderValidChain ? (
              <AppButton
                className='auth-confirmation__submit-btn'
                text={`SUBMIT PROOF`}
                iconRight={ICON_NAMES.arrowRight}
                size='large'
                onClick={submitZkp}
              />
            ) : (
              <AppButton
                className='auth-confirmation__submit-btn'
                text={`SWITCH NETWORK`}
                iconRight={ICON_NAMES.switchHorizontal}
                size='large'
                onClick={trySwitchChain}
              />
            )
          ) : (
            <AppButton
              className='auth-confirmation__submit-btn'
              text={`CONNECT WALLET`}
              iconRight={ICON_NAMES.metamask}
              size='large'
              onClick={connectWallet}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default AuthConfirmation
