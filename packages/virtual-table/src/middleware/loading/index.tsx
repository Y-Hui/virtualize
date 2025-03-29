/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import type { CSSProperties, ReactElement } from 'react'
import { createMiddleware, onResize } from '@are-visual/virtual-table'
import { cloneElement, isValidElement, useEffect, useMemo, useState } from 'react'
import LoadingRow from './row'

function useTableLoading<T = any>(
  ctx: MiddlewareContext<T>,
  options?: { loading?: boolean },
): MiddlewareResult<T> {
  const { loading = false } = options ?? {}
  const { estimatedRowHeight, headerWrapperRef, getScroller } = ctx

  const [count, setCount] = useState(10)

  useEffect(() => {
    const header = headerWrapperRef.current
    const container = getScroller()
    if (container == null) return
    return onResize(container, ({ height }) => {
      const headerHeight = header?.offsetHeight ?? 0
      setCount(Math.ceil((height - headerHeight) / estimatedRowHeight))
    })
  }, [getScroller, headerWrapperRef, estimatedRowHeight])

  const fakeDataSource = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      return { key: index }
    })
  }, [count])

  if (!loading) {
    return ctx
  }

  return {
    ...ctx,
    renderBodyRoot: (children) => {
      if (isValidElement(children)) {
        if (Object.prototype.hasOwnProperty.call(children.props, 'style')) {
          const style = (children.props as { style: CSSProperties }).style
          return cloneElement(children as ReactElement<{ style: CSSProperties }>, {
            style: {
              ...style,
              paddingBottom: undefined,
              paddingTop: undefined,
            },
          })
        }
      }
      return children
    },
    renderBodyContent: (_ignore, { columnDescriptor, startRowIndex }) => {
      return fakeDataSource.map((item, index) => {
        return (
          <LoadingRow
            key={item.key}
            style={{ height: estimatedRowHeight }}
            descriptor={columnDescriptor}
            rowKey={`__loading$-${index + startRowIndex}`}
          />
        )
      })
    },
  }
}

export const tableLoading = createMiddleware(useTableLoading)
