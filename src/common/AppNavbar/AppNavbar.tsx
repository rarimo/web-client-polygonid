import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppLogo } from '@/common'
import { useWeb3Context } from '@/contexts'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const { provider } = useWeb3Context()

  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />
      {provider?.address}
      <br />
      {provider?.chainId}
    </div>
  )
}

export default AppNavbar
