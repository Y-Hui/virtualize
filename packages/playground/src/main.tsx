import './index.css'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { __DEV__ } from './constant'

const Root = lazy(() => import('./pages/root'))
const DefaultDemo = lazy(() => import('./pages/default'))
const ScrollContainer = lazy(() => import('./pages/scroll-container'))
const SelectionDemo = lazy(() => import('./pages/selection'))
const ColumnResize = lazy(() => import('./pages/column-resize'))
const Expandable = lazy(() => import('./pages/expandable'))
const SummaryDemo = lazy(() => import('./pages/summary'))
const FullDemo = lazy(() => import('./pages/full'))

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <DefaultDemo />,
      },
      {
        path: '/scroll-container',
        element: <ScrollContainer />,
      },
      {
        path: '/selection',
        element: <SelectionDemo />,
      },
      {
        path: '/column-resize',
        element: <ColumnResize />,
      },
      {
        path: '/expandable',
        element: <Expandable />,
      },
      {
        path: '/summary',
        element: <SummaryDemo />,
      },
      {
        path: '/full',
        element: <FullDemo />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      wave={{ disabled: true }}
      button={{ autoInsertSpace: false }}
    >
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  </StrictMode>,
)
