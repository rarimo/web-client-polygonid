import './styles.scss'

import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'

import { AppButton } from '@/common'
import { useZkpContext } from '@/contexts'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProof: FC<Props> = () => {
  const [isStarted, setIsStarted] = useState(false)
  const { proveRequest, createProveRequest } = useZkpContext()

  const qrData = useMemo(() => {
    return proveRequest
  }, [proveRequest])

  const start = useCallback(async () => {
    await createProveRequest()
    setIsStarted(true)
  }, [createProveRequest])

  return (
    <div className='auth-proof'>
      <div className='auth-proof__header'>
        <h2 className='auth-proof__header-title'>{`Generate Proof`}</h2>
        <span className='auth-proof__header-subtitle'>{`Scan QR Code`}</span>
      </div>

      <div className='auth-proof__card'>
        <div className='auth-proof__card-header'>
          <div className='auth-proof__card-qr-wrp'>
            {isStarted ? (
              <QRCode className='auth-proof__card-qr' value={qrData} />
            ) : (
              <AppButton text={`Start`} onClick={start} />
            )}
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
