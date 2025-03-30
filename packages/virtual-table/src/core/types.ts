/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DetailedHTMLProps, HTMLAttributes, Key, ReactNode, TdHTMLAttributes } from 'react'
import type { VirtualTableCoreProps } from './table'
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

export interface TableInstance<T = any> {
  getCurrentProps: () => Readonly<VirtualTableCoreProps<T>>
  /** 获取 columns 数组（经过所有 middleware 处理过的 columns） */
  getColumns: () => ColumnType<T>[]
  getDOM: () => {
    root: HTMLDivElement | null
    headerWrapper: HTMLDivElement | null
    bodyWrapper: HTMLDivElement | null
    bodyRoot: HTMLTableElement | null
    body: HTMLTableSectionElement | null
  }
  /** 获取行虚拟化用到的数据 */
  getRowVirtualizeState: () => { startIndex: number, endIndex: number, overscan: number, estimateSize: number }
  /** 获取所有的行高信息。Map<rowKey, Map<key, number>> */
  getRowHeightMap: () => Map<Key, Map<Key, number>>
  /** 通过索引值，获取指定行所对应的滚动数值 */
  getScrollValueByRowIndex: (index: number) => number
  /** 通过 columnKey，获取指定列所对应的滚动数值 */
  getScrollValueByColumnKey: (columnKey: Key) => number
  /** 通过索引值，滚动到指定行 */
  scrollToRow: (index: number) => void
  /** 通过 columnKey，滚动到指定列 */
  scrollToColumn: (columnKey: Key) => void
  scrollTo: (options: ScrollToOptions) => void
  /** 通过 columnKey 获取 column 定义 */
  getColumnByKey: (columnKey: Key) => ColumnType<T> | undefined
  /** 通过索引获取 column 定义 */
  getColumnByIndex: (index: number) => ColumnType<T> | undefined
  /** 通过索引获取 columnKey */
  getColumnKeyByIndex: (index: number) => Key | undefined
  /** 获取所有的列宽 */
  getColumnWidths: () => Map<Key, number>
  /** 通过 columnKey 获取列宽 */
  getColumnWidthByKey: (columnKey: Key) => number | undefined
}
