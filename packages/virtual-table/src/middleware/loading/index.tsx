/* eslint-disable @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks */
import { Spin } from 'antd'

import { type MiddlewareContext } from '../../types'
import { createMiddleware } from '../index'

export const tableLoading = createMiddleware(function useTableLoading<T>(
  ctx: MiddlewareContext<T>,
  options: { loading?: boolean },
) {
  const { loading = false } = options || {}

  return {
    ...ctx,
    renderContent(children) {
      return <Spin spinning={loading}>{children}</Spin>
    },
  }
})
