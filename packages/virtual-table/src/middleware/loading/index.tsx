import './index.scss'

import { useMemo } from 'react'

import { type ColumnType, createMiddleware, type MiddlewareContext, type MiddlewareResult } from '../../core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useTableLoading<T = any>(
  ctx: MiddlewareContext<T>,
  options?: { loading?: boolean, lines?: number },
): MiddlewareResult<T> {
  const { loading = false, lines = 10 } = options ?? {}
  const { columns: rawColumns } = ctx

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
