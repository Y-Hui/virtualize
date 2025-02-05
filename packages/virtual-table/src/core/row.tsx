import type { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react'
import type { MiddlewareRenderCell, MiddlewareRenderRow } from './pipeline/types'
import type { InnerColumnDescriptor, OnRowType } from './types'
import clsx from 'clsx'
import { memo } from 'react'
import { findLastIndex } from '../utils/find-last-index'
import Cell from './cell'
import { useTableRowManager } from './context/row-manager'
import { pipelineRender } from './pipeline/render-pipeline'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

export interface RowProps<T> extends Omit<NativeProps, 'children'> {
  rowIndex: number
  rowData: T
  columns: InnerColumnDescriptor<T>
  onRow?: OnRowType<T>
  renderRow?: MiddlewareRenderRow
  renderCell?: MiddlewareRenderCell
}

function Row<T>(props: RowProps<T>) {
  const {
    className,
    rowIndex,
    rowData,
    columns: columnDescriptor,
    onRow,
    renderRow,
    renderCell,
    ...rest
  } = props

  const { updateRowHeight } = useTableRowManager()

  const { columns, descriptor } = columnDescriptor

  const lastFixedLeftColumnIndex = findLastIndex(descriptor, (x) => {
    if (x.type === 'blank') {
      return false
    }
    return isValidFixedLeft(x.column.fixed)
  })
  const firstFixedRightColumnIndex = descriptor.findIndex((x) => {
    if (x.type === 'blank') {
      return false
    }
    return isValidFixedRight(x.column.fixed)
  })

  const { className: extraClassName, ...extraProps } = onRow?.(rowData, rowIndex) ?? {}

  return pipelineRender(
    <tr
      {...rest}
      {...extraProps}
      className={clsx('virtual-table-row', className, extraClassName)}
      ref={(node) => {
        if (node == null) return
        // 小心陷阱：当 table 父元素为 display: none 时，依然会触发 updateRowHeight 函数，并设置高度为 0
        updateRowHeight(rowIndex, node.offsetHeight)
      }}
    >
      {descriptor.map((item, index) => {
        const { key } = item
        if (item.type === 'blank') {
          return <td key={key} />
        }
        const { column } = item
        return (
          <Cell
            key={key}
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
    { columns, rowIndex, rowData, columnDescriptor: descriptor },
  )
}

export default memo(Row) as <T>(props: RowProps<T>) => ReactElement
