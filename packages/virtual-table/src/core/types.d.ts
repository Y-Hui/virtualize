/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type HTMLAttributes,
  type Key,
  type ReactNode,
  type TdHTMLAttributes,
} from 'react'

export type AlignType = 'left' | 'right' | 'center'
export type SizeType = 'small' | 'middle' | 'large'
export type FixedType = 'left' | 'right'

interface ColumnTypeCommon<T> {
  className?: string
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

export type PipelineRender = (children: ReactNode) => ReactNode
