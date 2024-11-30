/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type TdHTMLAttributes,
} from 'react'

export type AnyObject = Record<string, any>

/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends string> = T | (string & {})

export type AlignType = 'left' | 'right' | 'center'
export type SizeType = 'small' | 'middle' | 'large'
export type FixedType = 'left' | 'right'

interface ColumnTypeCommon<T> {
  /** 表头列合并，设置为 0 时，不渲染	 */
  colSpan?: number
  title?: ReactNode
  align?: AlignType
  width?: string | number
  fixed?: FixedType
  minWidth?: number
  render?: (value: any, record: T, index: number) => ReactNode
  onHeaderCell?: (
    column: ColumnType<any>,
    index: number,
  ) => HTMLAttributes<any> & TdHTMLAttributes<any>
  onCell?: (data: T, index: number) => HTMLAttributes<any> & TdHTMLAttributes<any>
}

type ColumnTypeWithKey<T> = ColumnTypeCommon<T> & {
  key: Key
}

type ColumnTypeWithDataIndex<T> = ColumnTypeCommon<T> & {
  dataIndex: keyof T | (string & {})
}

export type ColumnType<T> = ColumnTypeWithKey<T> | ColumnTypeWithDataIndex<T>

export interface NecessaryProps<T> {
  dataSource?: T[]
  columns: ColumnType<T>[]
  // 假设 T 类型的声明是 { title: string }，但是实际运行时却是 { id: number; title: string; }
  // 那么 rowKey="id" 则会抛出一个错误：类型“"id"”不可分配给类型“keyof Data”
  // 这个联合类型解决了上述问题，你可以传入合法的 key 或者是一个自定义的字符串
  rowKey: keyof T | (string & {})
}
