import './styles.scss'

import { FC, HTMLAttributes } from 'react'
import QRCode from 'react-qr-code'
import { useEffectOnce } from 'react-use'

import { useZkpContext } from '@/contexts'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProof: FC<Props> = () => {
  const { proveRequest, createProveRequest } = useZkpContext()

  useEffectOnce(() => {
    createProveRequest()
  })

  return (
    <div className='auth-proof'>
      <div className='auth-proof__header'>
        <h2 className='auth-proof__header-title'>{`Generate Proof`}</h2>
        <span className='auth-proof__header-subtitle'>{`Scan QR Code`}</span>
      </div>

      <div className='auth-proof__card'>
        <div className='auth-proof__card-header'>
          <div className='auth-proof__card-qr-wrp'>
            <QRCode className='auth-proof__card-qr' value={proveRequest} />
          </div>
        </div>
        <div className='auth-proof__card-body'>
          <div className='auth-proof__card-title'>
            {`Scan the QR code with your Polygon ID wallet to generate proof`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthProof
