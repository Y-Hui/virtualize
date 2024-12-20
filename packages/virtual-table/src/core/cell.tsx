/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'classnames'
import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  memo,
  type ReactElement,
} from 'react'

import { type AnyObject } from '../types'
import { useTableSticky } from './context/sticky'
import { type ColumnType, type PipelineRender } from './types'
import { pipelineRender } from './utils/render-pipeline'
import { isValidFixed, isValidFixedLeft, isValidFixedRight } from './utils/verification'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>

export interface CellProps<T> extends NativeProps {
  column: ColumnType<T>
  columnIndex: number
  rowIndex: number
  rowData: T
  cellRender?: PipelineRender
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
    cellRender,
    ...restProps
  } = props

  const { align, fixed, onCell } = column
  const { size: stickySizes } = useTableSticky()

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

  return pipelineRender(
    <td
      {...restProps}
      {...extraProps}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={clsx(
        'virtual-table-cell',
        align != null && `virtual-table-align-${align}`,
        isValidFixed(fixed) && 'virtual-table-sticky-cell',
        className,
        column.className,
        extraClassName,
      )}
      style={{
        ...style,
        ...extraStyle,
        left: isValidFixedLeft(fixed) ? stickySizes[columnIndex] : undefined,
        right: isValidFixedRight(fixed) ? stickySizes[columnIndex] : undefined,
      }}
    >
      {getTableCellContent(rowIndex, rowData as AnyObject, column)}
    </td>,
    cellRender,
    { column, columnIndex },
  )
}

export default memo(Cell) as <T>(props: CellProps<T>) => ReactElement
