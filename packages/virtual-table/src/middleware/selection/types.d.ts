/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ComponentType, type HTMLAttributes, type Key, type ReactNode, type TdHTMLAttributes } from 'react'

import { type AnyObject, type ColumnExtra, type FixedType } from '../../core'

export type RowSelectMethod = 'all' | 'none' | 'invert' | 'single' | 'multiple'
export type SelectionSelectFn<T = AnyObject> = (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void
export type GetComponentProps<DataType> = (data: DataType, index?: number) => HTMLAttributes<any> & TdHTMLAttributes<any>

export interface TableRowSelection<T = AnyObject> extends ColumnExtra {
  component?: ComponentType<SelectionProps>
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean
  multiple?: boolean
  selectedRowKeys?: Key[]
  defaultSelectedRowKeys?: Key[]
  onChange?: (selectedRowKeys: Key[], selectedRows: T[], info: {
    type: RowSelectMethod
  }) => void
  // TODO:
  getCheckboxProps?: (record: T) => SelectionProps & Record<string, unknown>
  onSelect?: SelectionSelectFn<T>
  hideSelectAll?: boolean
  fixed?: FixedType
  columnWidth?: string | number
  columnTitle?: ReactNode | ((checkboxNode: ReactNode) => ReactNode)
  renderCell?: (value: boolean, record: T, index: number, originNode: ReactNode) => ReactNode
  onCell?: GetComponentProps<T>
}

export type SelectionProps = {
  multiple?: boolean
  value?: boolean
  onChange?: (nextValue: boolean, e: Event) => void
  indeterminate?: boolean
  disabled?: boolean
}
