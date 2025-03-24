import './index.css'
import 'react-resizable/css/styles.css'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

const Root = lazy(() => import('./pages/root'))
const DefaultDemo = lazy(() => import('./pages/default'))
const ScrollContainer = lazy(() => import('./pages/scroll-container'))
const SelectionDemo = lazy(() => import('./pages/selection'))
const ColumnResize = lazy(() => import('./pages/column-resize'))
const Expandable = lazy(() => import('./pages/expandable'))
const SummaryDemo = lazy(() => import('./pages/summary'))
const RowsAndColumns = lazy(() => import('./pages/rows-and-columns'))
const FullDemo = lazy(() => import('./pages/full'))
const AntdDemo = lazy(() => import('./pages/antd'))
const Details = lazy(() => import('./pages/details/index'))
const ComplexLayout = lazy(() => import('./pages/complex-layout'))

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
        path: '/rows-and-columns',
        element: <RowsAndColumns />,
      },
      {
        path: '/full',
        element: <FullDemo />,
      },
      {
        path: '/antd',
        element: <AntdDemo />,
      },
      {
        path: '/details',
        element: <Details />,
      },
      {
        path: '/complex-layout',
        element: <ComplexLayout />,
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
