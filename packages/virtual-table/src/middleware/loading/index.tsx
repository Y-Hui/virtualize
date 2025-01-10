import './index.scss'

import { useMemo } from 'react'

import { createMiddleware } from '../../core/pipeline/create'
import { type ColumnType, type MiddlewareContext } from '../../types'

export const tableLoading = createMiddleware(function useTableLoading<T>(
  ctx: MiddlewareContext<T>,
  options: { loading?: boolean, lines?: number },
) {
  const { loading = false, lines = 10 } = options || {}
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
})
