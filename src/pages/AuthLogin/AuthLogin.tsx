import './styles.scss'

import { FC, HTMLAttributes, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppButton } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import { EXTERNAL_PROVIDERS } from '@/contexts/Web3ProviderContext/enums'
import { RoutesPaths } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthLogin: FC<Props> = () => {
  const { init } = useWeb3Context()
  const { startListeningProve } = useZkpContext()

  const navigate = useNavigate()

  const connect = useCallback(async () => {
    try {
      await init(EXTERNAL_PROVIDERS.WalletConnect)
      await startListeningProve()
      navigate(RoutesPaths.authProof)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [init, navigate, startListeningProve])

  return (
    <div className='auth-login'>
      <div className='auth-login__header'>
        <h2 className='auth-login__header-title'>{`Sign In`}</h2>
        <span className='auth-login__header-subtitle'>{`Connect Your Wallet`}</span>
      </div>

      <AppButton text={`Connect Wallet`} onClick={connect} />
    </div>
  )
}

export default AuthLogin
