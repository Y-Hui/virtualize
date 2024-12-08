/* eslint-disable @eslint-react/no-clone-element */
import { Empty } from 'antd'
import { cloneElement, isValidElement, useCallback } from 'react'

import { type MiddlewareContext, type MiddlewareRender } from '../../types'
import { createMiddleware } from '../index'

export const tableEmpty = createMiddleware(function useTableEmpty<T>(
  ctx: MiddlewareContext<T>,
) {
  const { dataSource } = ctx

  const showEmpty = dataSource == null ? true : dataSource.length === 0

  const renderBody: MiddlewareRender = useCallback(
    (children, options) => {
      if (!showEmpty) {
        return children
      }

      const { columns } = options

      if (isValidElement(children)) {
        return cloneElement(children, children.props, [
          ...(children.props?.children ?? []),
          <tr key="virtual-table-placeholder$">
            <td colSpan={columns?.length}>
              <div style={{ padding: 16 }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            </td>
          </tr>,
        ])
      }

      return (
        <>
          {children}
          {showEmpty && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </>
      )
    },
    [showEmpty],
  )

  if (!showEmpty) {
    return ctx
  }

  return {
    ...ctx,
    renderBody,
  }
})
