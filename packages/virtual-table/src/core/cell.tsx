/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'classnames'
import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  memo,
  type ReactElement,
} from 'react'

import { type AnyObject, type ColumnType } from '../types'
import { useTableColumns } from './context/table-columns'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>

export interface CellProps<T> extends NativeProps {
  column: ColumnType<T>
  columnIndex: number
  rowIndex: number
  rowData: T
}

function getTableCellContent<T extends AnyObject>(
  index: number,
  data: T,
  column: ColumnType<any>,
) {
  const { render } = column
  const rowData = data as AnyObject
  if ('dataIndex' in column) {
    const dataIndex = column.dataIndex as string
    if (typeof render !== 'function') {
      return rowData[dataIndex]
    }
    return render(dataIndex == null ? data : rowData[dataIndex], data, index)
  }
  return render?.(data, data, index) ?? null
}

function Cell<T>(props: CellProps<T>) {
  const {
    className,
    style,
    children,
    column,
    rowData,
    rowIndex,
    columnIndex,
    ...restProps
  } = props

  const { align, fixed, onCell } = column
  const { stickySizes } = useTableColumns()

  const {
    className: extraClassName,
    style: extraStyle,
    colSpan,
    rowSpan,
    ...extraProps
  } = onCell?.(rowData, rowIndex) || {}

  if (colSpan === 0 || rowSpan === 0) {
    return null
  }

  return (
    <td
      {...restProps}
      {...extraProps}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={clsx(
        'virtual-table-cell',
        align != null && `virtual-table-align-${align}`,
        typeof fixed === 'string' && 'virtual-table-sticky-cell',
        className,
        extraClassName,
      )}
      style={{
        ...style,
        ...extraStyle,
        left: fixed === 'left' ? stickySizes[columnIndex] : undefined,
        right: fixed === 'right' ? stickySizes[columnIndex] : undefined,
      }}
    >
      {getTableCellContent(rowIndex, rowData as AnyObject, column)}
    </td>
  )
}

export default memo(Cell) as <T>(props: CellProps<T>) => ReactElement
