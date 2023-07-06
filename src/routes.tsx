import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import { AppNavbar } from '@/common'
import { RoutesPaths } from '@/enums'
import { AuthLayout } from '@/layouts'

export const AppRoutes = () => {
  const AuthLogin = lazy(() => import('@/pages/AuthLogin/AuthLogin'))
  const AuthProof = lazy(() => import('@/pages/AuthProof/AuthProof'))
  const AuthSuccess = lazy(() => import('@/pages/AuthSuccess'))

  const router = createBrowserRouter([
    {
      path: RoutesPaths.app,
      element: (
        <Suspense fallback={<></>}>
          <AppNavbar />
          <AnimatePresence>
            <div className='app__main'>
              <Outlet />
            </div>
          </AnimatePresence>
        </Suspense>
      ),
      children: [
        {
          path: RoutesPaths.auth,
          element: <AuthLayout />,
          children: [
            {
              index: true,
              path: RoutesPaths.authLogin,
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
          ],
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
