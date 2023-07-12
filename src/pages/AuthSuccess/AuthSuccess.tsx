import './styles.scss'

import { config, DEFAULT_CHAIN, SUPPORTED_CHAINS_DETAILS } from '@config'
import { FC, HTMLAttributes } from 'react'

import { AppButton, Icon } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthSuccess: FC<Props> = () => {
  const { provider } = useWeb3Context()
  const { verificationSuccessTx } = useZkpContext()

  return (
    <div className='auth-success'>
      <div className='auth-success__header'>
        <div className='auth-success__header-icon-wrp'>
          <Icon className='auth-success__header-icon' name={ICON_NAMES.check} />
        </div>
        <h2 className='auth-success__header-title'>{`Proof Submitted`}</h2>
      </div>

      <div className='auth-success__minted-nft'>
        <span className='auth-success__minted-nft-title'>
          {`You’ve received an SBT / NFT `}
        </span>

        <div className='auth-success__minted-nft-card'>
          <div className='auth-success__minted-nft-card-img-wrp'>
            <img
              src='/images/minted-nft-stub.png'
              alt=''
              className='auth-success__minted-nft-card-img'
            />
          </div>

          <div className='auth-success__minted-nft-card-details'>
            <span className='auth-success__minted-nft-card-title'>
              {`POH Early Adopter`}
            </span>

            <span className='auth-success__minted-nft-card-subtitle'>
              <button
                onClick={() =>
                  copyToClipboard('66eus7EDFSFV3djAp9otX75w284vs8SODot27XHn21')
                }
              >
                {abbrCenter(
                  config?.[`DEMO_SBT_CONTRACT_ADDRESS_${DEFAULT_CHAIN}`],
                )}
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className='auth-success__card'>
        <span className='auth-success__card-title'>{`Check transaction`}</span>

        <div className='auth-success__copy-field-wrp'>
          <div className='auth-success__copy-field'>
            {abbrCenter(verificationSuccessTx.get, 10)}
            <AppButton
              scheme='none'
              modification='none'
              size='none'
              iconLeft={ICON_NAMES.externalLink}
              href={provider?.getTxUrl?.(
                SUPPORTED_CHAINS_DETAILS[DEFAULT_CHAIN],
                verificationSuccessTx.get,
              )}
              target='_blank'
            />
          </div>
        </div>
      </div>

      <AppButton
        className='auth-success__return-btn'
        routePath={'/'}
        text={`RETURN HOME`}
        size={`large`}
      />
    </div>
  )
}

export default AuthSuccess
