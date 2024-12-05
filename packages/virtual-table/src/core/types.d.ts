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

export interface ColumnExtra {}

interface ColumnTypeCommon<T> extends ColumnExtra {
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
  [key: string]: unknown
}

type ColumnTypeWithDataIndex<T> = ColumnTypeCommon<T> & {
  dataIndex: keyof T | (string & {})
  [key: string]: unknown
}

export type ColumnType<T> = ColumnTypeWithKey<T> | ColumnTypeWithDataIndex<T>

export interface PipelineRenderOptions {
  /** renderCell、renderHeaderCell 存在 */
  column?: ColumnType<any>
  /** renderCell、renderHeaderCell 存在 */
  columnIndex?: number
  /** 列宽。renderHeaderCell 存在 */
  columnWidthList?: number[]

  /** renderRow 存在 */
  rowIndex?: number
  /** renderRow 存在 */
  columns?: ColumnType<any>[]
  /** renderRow 存在 */
  rowData?: any
}
export type PipelineRender = (
  children: ReactNode,
  options: PipelineRenderOptions,
) => ReactNode
