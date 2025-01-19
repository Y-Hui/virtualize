import type { ColumnType, MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import { createMiddleware } from '@are-visual/virtual-table'
import { useMemo } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useTableLoading<T = any>(
  ctx: MiddlewareContext<T>,
  options?: { loading?: boolean },
): MiddlewareResult<T> {
  const { loading = false } = options ?? {}
  const { columns: rawColumns, visibleCount: lines } = ctx

  const fakeDataSource = useMemo(() => {
    return Array.from({ length: lines }, (_, index) => {
      return { key: index }
    }) as T[]
  }, [lines])

  const columns = useMemo((): ColumnType<T>[] => {
    if (!loading) {
      return rawColumns
    }

    return rawColumns.map((column): ColumnType<T> => {
      return {
        ...column,
        onCell() {
          return { className: 'virtual-table-loading-cell' }
        },
        render() {
          return <div className="virtual-table-loading-skeleton" />
        },
      }
    })
  }, [loading, rawColumns])

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
