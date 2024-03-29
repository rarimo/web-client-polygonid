import '@/styles/index.scss'
import '@/localization'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

import { config } from '@config'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { initApi, initRarimoCoreApi } from '@/api'
import { AppRoutes } from '@/routes'

const root = createRoot(document.getElementById('root') as Element)

initApi(config.API_URL)
initRarimoCoreApi(config.RARIMO_CORE_API_URL)

if (import.meta.env.MODE === 'development') {
  root.render(<AppRoutes />)
} else {
  root.render(
    <StrictMode>
      <AppRoutes />
    </StrictMode>,
  )
}
