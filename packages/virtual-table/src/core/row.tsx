import type { DetailedHTMLProps, HTMLAttributes, Key, ReactElement } from 'react'
import type { MiddlewareRenderCell, MiddlewareRenderRow } from './pipeline/types'
import type { ColumnType, OnRowType } from './types'
import clsx from 'clsx'
import { memo } from 'react'
import { findLastIndex } from '../utils/find-last-index'
import Cell from './cell'
import { useTableShared } from './context/shared'
import { pipelineRender } from './pipeline/render-pipeline'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

export interface RowProps<T> extends Omit<NativeProps, 'children'> {
  rowIndex: number
  rowData: T
  columns: ColumnType<T>[]
  onRow?: OnRowType<T>
  renderRow?: MiddlewareRenderRow
  renderCell?: MiddlewareRenderCell
}

function Row<T>(props: RowProps<T>) {
  const {
    className,
    rowIndex,
    rowData,
    columns,
    onRow,
    renderRow,
    renderCell,
    ...rest
  } = props

  const { updateRowHeight } = useTableShared()

  const lastFixedLeftColumnIndex = findLastIndex(columns, (x) => isValidFixedLeft(x.fixed))
  const firstFixedRightColumnIndex = columns.findIndex((x) => isValidFixedRight(x.fixed))

  const { className: extraClassName, ...extraProps } = onRow?.(rowData, rowIndex) ?? {}

  return pipelineRender(
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
        const key = 'key' in column ? (column.key as Key) : column.dataIndex
        return (
          <Cell
            key={typeof key === 'symbol' ? index : key}
            className={clsx(
              lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
              firstFixedRightColumnIndex === index
              && 'virtual-table-cell-fix-right-first',
            )}
            column={column}
            rowIndex={rowIndex}
            rowData={rowData}
            columnIndex={index}
            renderCell={renderCell}
          />
        )
      })}
    </tr>,
    renderRow,
    { columns, rowIndex, rowData },
  )
}

export default memo(Row) as <T>(props: RowProps<T>) => ReactElement
