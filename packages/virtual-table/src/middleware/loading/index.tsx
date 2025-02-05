/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnType, MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import { createMiddleware, onResize } from '@are-visual/virtual-table'
import { useEffect, useMemo, useState } from 'react'

function useTableLoading<T = any>(
  ctx: MiddlewareContext<T>,
  options?: { loading?: boolean },
): MiddlewareResult<T> {
  const { loading = false } = options ?? {}
  const { columns: rawColumns, estimatedRowHeight, headerWrapperRef, getScroller } = ctx

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
    }) as T[]
  }, [count])

  const columns = useMemo((): ColumnType<T>[] => {
    if (!loading) {
      return rawColumns
    }

    return rawColumns.map((column): ColumnType<T> => {
      return {
        ...column,
        onCell() {
          return { className: 'virtual-table-loading-cell', style: { height: estimatedRowHeight } }
        },
        render() {
          return <div className="virtual-table-loading-skeleton" />
        },
      }
    })
  }, [loading, rawColumns, estimatedRowHeight])

  if (!loading) {
    return ctx
  }

  return {
    ...ctx,
    columns,
    rowKey: 'key',
    dataSource: fakeDataSource,
  }
}

export const tableLoading = createMiddleware(useTableLoading)
