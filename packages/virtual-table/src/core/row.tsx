import type { DetailedHTMLProps, HTMLAttributes, Key, ReactElement } from 'react'
import type { MiddlewareRenderCell, MiddlewareRenderRow } from './pipeline/types'
import type { InnerColumnDescriptor, OnRowType } from './types'
import clsx from 'clsx'
import { memo } from 'react'
import { findLastIndex } from '../utils/find-last-index'
import Cell from './cell'
import { pipelineRender } from './pipeline/render-pipeline'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

export interface OnRefCallbackArgs<T> {
  node: HTMLTableRowElement | null
  rowKey: Key
  rowIndex: number
  rowData: T
}

export interface RowProps<T> extends Omit<NativeProps, 'children'> {
  rowIndex: number
  rowKey: Key
  rowData: T
  columns: InnerColumnDescriptor<T>
  onRow?: OnRowType<T>
  renderRow?: MiddlewareRenderRow
  renderCell?: MiddlewareRenderCell
  onRefCallback?: (args: OnRefCallbackArgs<T>) => void
}

function Row<T>(props: RowProps<T>) {
  const {
    className,
    rowKey,
    rowIndex,
    rowData,
    columns: columnDescriptor,
    onRow,
    renderRow,
    renderCell,
    onRefCallback,
    ...rest
  } = props

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
      data-row-index={rowIndex}
      ref={(node) => {
        onRefCallback?.({ node, rowKey, rowIndex, rowData })
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
            renderCell={renderCell}
          />
        )
      })}
    </tr>,
    renderRow,
    { columns, rowKey, rowIndex, rowData, columnDescriptor: descriptor },
  )
}

export default memo(Row) as <T>(props: RowProps<T>) => ReactElement
