/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DetailedHTMLProps, HTMLAttributes, Key, ReactNode, TdHTMLAttributes } from 'react'
import type { FixedType } from './utils/verification'

export type AnyObject = Record<string, any>
export type OnRowType<T = any> = (
  record: T,
  index: number,
) => Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>,
  'children' | 'ref'
>

export type { FixedType }
export type AlignType = 'left' | 'right' | 'center'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ColumnExtra<T = any> { }

interface ColumnTypeCommon<T> extends ColumnExtra<T> {
  className?: string
  /** 表头列合并，设置为 0 时，不渲染 */
  colSpan?: number
  title?: ReactNode
  align?: AlignType
  minWidth?: number
  width?: string | number
  fixed?: FixedType
  render?: (value: any, record: T, index: number) => ReactNode
  onHeaderCell?: (column: ColumnType<any>, index: number) => HTMLAttributes<any> & TdHTMLAttributes<any>
  onCell?: (data: T, index: number) => HTMLAttributes<any> & TdHTMLAttributes<any>
}

type ColumnTypeWithKey<T> = ColumnTypeCommon<T> & {
  key: Key
  [key: string]: unknown
}

type ColumnTypeWithDataIndex<T> = ColumnTypeCommon<T> & {
  dataIndex: keyof T | (string & {})
  [key: string]: unknown
}

export type ColumnType<T> = ColumnTypeWithKey<T> | ColumnTypeWithDataIndex<T>

export type ColumnDescriptor<T = any> =
  | { key: Key, type: 'blank', width: number }
  | { key: Key, type: 'normal', column: ColumnType<T> }

export interface ColumnBlank {
  left: number
  leftKey: Key
  right: number
  rightKey: Key
}

export interface InnerColumnDescriptor<T> {
  descriptor: ColumnDescriptor<T>[]
  columns: ColumnType<T>[]
}
