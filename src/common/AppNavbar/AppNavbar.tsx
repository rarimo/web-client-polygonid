import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback, useState } from 'react'

import { AppButton, AppLogo, Drawer } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, ErrorHandler } from '@/helpers'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const [isDrawerShown, setIsDrawerShown] = useState(false)
  const { provider, init } = useWeb3Context()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [init])

  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />

      <AppButton
        className='app-navbar__menu-btn'
        scheme='none'
        iconRight={ICON_NAMES.menu}
        onClick={() => setIsDrawerShown(!isDrawerShown)}
      />

      <Drawer isShown={isDrawerShown} updateIsShown={setIsDrawerShown}>
        <div className='app-navbar__drawer-body'>
          <AppButton
            className='navbar__connection-btn'
            scheme='flat'
            text={
              !provider?.isConnected
                ? `CONNECT METAMASK`
                : abbrCenter(provider?.address ?? '')
            }
            iconLeft={ICON_NAMES.metamask}
            onClick={connectProvider}
            isDisabled={provider?.isConnected}
          />
        </div>
      </Drawer>

      <div className='app-navbar__actions'>
        <AppButton
          className='navbar__connection-btn'
          scheme='flat'
          text={
            !provider?.isConnected
              ? `CONNECT METAMASK`
              : abbrCenter(provider?.address ?? '')
          }
          iconLeft={ICON_NAMES.metamask}
          onClick={connectProvider}
          isDisabled={provider?.isConnected}
        />
      </div>
    </div>
  )
}

export default AppNavbar
