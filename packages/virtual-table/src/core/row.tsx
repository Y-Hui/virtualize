import clsx from 'classnames'
import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type Key,
  memo,
  type ReactElement,
} from 'react'

import { findLastIndex } from '../utils/find-last-index'
import Cell from './cell'
import { useTableShared } from './context/shared'
import { type ColumnType, type OnRowType, type PipelineRender } from './types'
import { pipelineRender } from './utils/render-pipeline'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

export interface RowProps<T> extends NativeProps {
  rowIndex: number
  rowData: T
  columns: ColumnType<T>[]
  onRow?: OnRowType<T>
  rowRender?: PipelineRender
  cellRender?: PipelineRender
}

function Row<T>(props: RowProps<T>) {
  const {
    className,
    children,
    rowIndex,
    rowData,
    columns,
    onRow,
    rowRender,
    cellRender,
    ...rest
  } = props

  const { updateRowHeight } = useTableShared()

  const lastFixedLeftColumnIndex = findLastIndex(columns, (x) =>
    isValidFixedLeft(x.fixed),
  )
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
              firstFixedRightColumnIndex === index &&
                'virtual-table-cell-fix-right-first',
            )}
            column={column}
            rowIndex={rowIndex}
            rowData={rowData}
            columnIndex={index}
            cellRender={cellRender}
          />
        )
      })}
    </tr>,
    rowRender,
    { columns, rowIndex, rowData },
  )
}

export default memo(Row) as <T>(props: RowProps<T>) => ReactElement
