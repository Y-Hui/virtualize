/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react'
import type { MiddlewareRenderCell } from './pipeline/types'
import type { AnyObject, ColumnType } from './types'
import clsx from 'clsx'
import { memo } from 'react'
import { useTableSticky } from './context/sticky'
import { pipelineRender } from './pipeline/render-pipeline'
import { getKey } from './utils/get-key'
import { isValidFixed, isValidFixedLeft, isValidFixedRight } from './utils/verification'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>

export interface CellProps<T> extends Omit<NativeProps, 'children'> {
  column: ColumnType<T>
  columnIndex: number
  rowIndex: number
  rowData: T
  renderCell?: MiddlewareRenderCell
}

function getTableCellContent<T extends AnyObject>(
  index: number,
  data: T,
  column: ColumnType<any>,
): any {
  const { render } = column
  const rowData = data as AnyObject
  if ('dataIndex' in column) {
    const dataIndex = column.dataIndex as string
    if (typeof render !== 'function') {
      return rowData[dataIndex]
    }
    return render(rowData[dataIndex], data, index)
  }
  return render?.(data, data, index) ?? null
}

function Cell<T>(props: CellProps<T>) {
  const {
    className,
    style,
    column,
    rowData,
    rowIndex,
    columnIndex,
    renderCell,
    ...restProps
  } = props

  const { align, fixed, onCell } = column
  const key = getKey(column)
  const { size: stickySizes } = useTableSticky()

  const {
    className: extraClassName,
    style: extraStyle,
    colSpan,
    rowSpan,
    ...extraProps
  } = onCell?.(rowData, rowIndex) ?? {}

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
        left: isValidFixedLeft(fixed) ? stickySizes.get(key) : undefined,
        right: isValidFixedRight(fixed) ? stickySizes.get(key) : undefined,
      }}
    >
      {getTableCellContent(rowIndex, rowData as AnyObject, column)}
    </td>,
    renderCell,
    { column, columnIndex },
  )
}

export default memo(Cell) as <T>(props: CellProps<T>) => ReactElement
