import type { Key, ReactNode } from 'react'

export type AnyObject = Record<string, any>

export type FixedType = 'left' | 'right'

interface ColumnTypeCommon<T> {
  width?: string | number
  minWidth?: number
  title?: ReactNode
  fixed?: FixedType
  render?: (value: any, record: T, index: number) => ReactNode
}

type ColumnTypeWithKey<T> = ColumnTypeCommon<T> & {
  key: Key
  [key: string]: unknown
}

type ColumnTypeWithDataIndex<T> = ColumnTypeCommon<T> & {
  // 这个联合类型能够给你提示 T 类型中所有的 key，同时也允许你自定义任何的 string 而不报错
  dataIndex: keyof T | (string & {})
  [key: string]: unknown
}

export type ColumnType<T> = ColumnTypeWithKey<T> | ColumnTypeWithDataIndex<T>

export type ColumnDescriptor<T = any> =
  | { key: Key, type: 'blank', width: number }
  | { key: Key, type: 'normal', column: ColumnType<T> }
