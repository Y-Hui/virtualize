import type { Key } from 'react'
import type { NecessaryProps } from '../internal'
import type { AnyObject, ColumnType } from '../types'

export function getKey<T>(column: ColumnType<T>) {
  return 'key' in column ? (column.key as Key) : column.dataIndex as string
}

export function getRowKey<T>(rowData: T, rowKey: NecessaryProps<T>['rowKey']): Key {
  if (typeof rowKey === 'function') {
    return rowKey(rowData)
  }
  return (rowData as AnyObject)[rowKey as string] as Key
}
