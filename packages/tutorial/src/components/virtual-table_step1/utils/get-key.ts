import type { Key } from 'react'
import type { ColumnType } from '../types'

export function getKey<T>(column: ColumnType<T>) {
  return 'key' in column ? (column.key as Key) : column.dataIndex as string
}
