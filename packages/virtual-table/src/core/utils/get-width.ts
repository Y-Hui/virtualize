import type { ColumnType } from '../types'

export function getColumnWidth<T>(column: ColumnType<T>, defaultColumnWidth: number) {
  return Number.isFinite(column.width) ? column.width! : defaultColumnWidth
}
