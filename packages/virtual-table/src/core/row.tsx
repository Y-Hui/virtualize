import clsx from 'classnames'
import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  memo,
  type ReactElement,
} from 'react'

import { type ColumnType } from '../types'
import { findLastIndex } from '../utils/find-last-index'
import Cell from './cell'
import { useTableShared } from './context/shared'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

export interface RowProps<T> extends NativeProps {
  rowIndex: number
  rowData: T
  columns: ColumnType<T>[]
  onRow?: (record: T, index: number) => Omit<NativeProps, 'children' | 'ref'>
}

function Row<T>(props: RowProps<T>) {
  const { className, children, rowIndex, rowData, columns, onRow, ...rest } = props

  const { updateRowHeight } = useTableShared()

  const lastFixedLeftColumnIndex = findLastIndex(columns, (x) => x.fixed === 'left')
  const lastFixedRightColumnIndex = columns.findIndex((x) => x.fixed === 'right')

  const { className: extraClassName, ...extraProps } = onRow?.(rowData, rowIndex) ?? {}

  return (
    <tr
      {...rest}
      {...extraProps}
      className={clsx('virtual-table-row', className, extraClassName)}
      ref={(node) => {
        if (node == null) return
        updateRowHeight(rowIndex, node.offsetHeight)
      }}
    >
      {columns.map((column, index) => {
        const key = 'key' in column ? column.key : column.dataIndex
        return (
          <Cell
            key={typeof key === 'symbol' ? index : key}
            className={clsx(
              lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
              lastFixedRightColumnIndex === index && 'virtual-table-cell-fix-right-last',
            )}
            column={column}
            rowIndex={rowIndex}
            rowData={rowData}
            columnIndex={index}
          />
        )
      })}
    </tr>
  )
}

export default memo(Row) as <T>(props: RowProps<T>) => ReactElement
