import './style.scss'

import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './app'

const Step0 = lazy(() => import('./pages/step0'))
const Step1 = lazy(() => import('./pages/step1'))

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/step/0',
        element: <Step0 />,
      },
      {
        path: '/step/1',
        element: <Step1 />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
