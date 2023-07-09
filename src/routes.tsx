import { lazy } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import App from '@/App'
import { Web3ProviderContextProvider } from '@/contexts'
import { RoutesPaths } from '@/enums'

export const AppRoutes = () => {
  const AuthLogin = lazy(() => import('@/pages/AuthLogin'))
  const AuthProof = lazy(() => import('@/pages/AuthProof'))
  const AuthSuccess = lazy(() => import('@/pages/AuthSuccess'))

  const router = createBrowserRouter([
    {
      element: (
        <Web3ProviderContextProvider>
          <App>
            <Outlet />
          </App>
        </Web3ProviderContextProvider>
      ),
      children: [
        {
          index: true,
          // path: RoutesPaths.authLogin,
          element: <AuthLogin />,
        },
        {
          path: RoutesPaths.authProof,
          element: <AuthProof />,
        },
        {
          path: RoutesPaths.authSuccess,
          element: <AuthSuccess />,
        },

        {
          path: '',
          element: <Navigate replace to={RoutesPaths.authLogin} />,
        },
        {
          path: '/',
          element: <Navigate replace to={RoutesPaths.authLogin} />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutesPaths.authLogin} />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
