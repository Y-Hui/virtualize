import './style.scss'

import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './app'

const Step0 = lazy(() => import('./pages/step0'))
const Step1 = lazy(() => import('./pages/step1'))
const Step2 = lazy(() => import('./pages/step2'))
const Step3 = lazy(() => import('./pages/step3'))
const Step4 = lazy(() => import('./pages/step4'))
const Step5 = lazy(() => import('./pages/step5'))
const Step6 = lazy(() => import('./pages/step6'))

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
      {
        path: '/step/2',
        element: <Step2 />,
      },
      {
        path: '/step/3',
        element: <Step3 />,
      },
      {
        path: '/step/4',
        element: <Step4 />,
      },
      {
        path: '/step/5',
        element: <Step5 />,
      },
      {
        path: '/step/6',
        element: <Step6 />,
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
