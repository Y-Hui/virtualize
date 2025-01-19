/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnExtra } from '@are-visual/virtual-table'
import type { ComponentType, HTMLAttributes, Key, ReactNode, TdHTMLAttributes } from 'react'

export type RowSelectMethod = 'all' | 'none' | 'invert' | 'single' | 'multiple'
export type SelectionSelectFn<T = any> = (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void
export type GetComponentProps<DataType> = (data: DataType, index?: number) => HTMLAttributes<any> & TdHTMLAttributes<any>

export type SelectionColumnTitleProps = SelectionProps & {
  allKeys: Key[]
  onClear: () => void
  onSelectAll: () => void
  onSelectInvert: () => void
}

export interface TableRowSelection<T = any> {
  component?: ComponentType<SelectionProps>
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean
  multiple?: boolean
  selectedRowKeys?: Key[]
  defaultSelectedRowKeys?: Key[]
  onChange?: (selectedRowKeys: Key[], selectedRows: T[], info: {
    type: RowSelectMethod
  }) => void
  getSelectionProps?: (record: T) => SelectionProps & Record<string, unknown>
  onSelect?: SelectionSelectFn<T>
  hideSelectAll?: boolean
  fixed?: boolean
  columnWidth?: string | number
  columnTitle?: ReactNode | ((checkboxNode: ReactNode, props: SelectionColumnTitleProps) => ReactNode)
  renderCell?: (value: boolean, record: T, index: number, originNode: ReactNode) => ReactNode
  onCell?: GetComponentProps<T>
  extraColumnProps?: ColumnExtra
}

export interface SelectionProps {
  multiple?: boolean
  value?: boolean
  onChange?: (nextValue: boolean, e: Event) => void
  indeterminate?: boolean
  disabled?: boolean
}
