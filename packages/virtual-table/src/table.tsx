import './styles/table.scss'

import clsx from 'classnames'
import {
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
} from 'react'

import { useTablePipeline } from './core/hooks/useTablePipeline'
import Table, { type VirtualTableCoreProps, type VirtualTableCoreRef } from './core/table'
import { selection, type TableRowSelection } from './middleware/selection'
import { type SizeType } from './types'

export interface VirtualTableProps<T>
  extends Omit<VirtualTableCoreProps<T>, 'estimatedRowHeight' | 'stickyHeader'> {
  size?: SizeType

  // TODO:
  bordered?: boolean

  // TODO:
  loading?: boolean

  /** 预计每行高度 */
  estimatedRowHeight?: number
  sticky?: boolean | { offsetHeader: number }
  rowSelection?: TableRowSelection<T>
}

function getDefaultEstimatedRowHeight(size: SizeType, height?: number) {
  if (typeof height === 'number' && Number.isFinite(height)) {
    return height
  }

  // cell 高度 + 1px 边框
  switch (size) {
    case 'small':
      return 39
    case 'large':
      return 65
    default:
      return 57
  }
}

function VirtualTable<T>(
  props: VirtualTableProps<T>,
  ref: ForwardedRef<VirtualTableCoreRef>,
) {
  const {
    size = 'middle',
    estimatedRowHeight: rowHeight,
    sticky,
    rowSelection,
    loading,
    bordered,
    pipeline: extraPipeline,
    ...rest
  } = props

  const estimatedRowHeight = getDefaultEstimatedRowHeight(size, rowHeight)
  const pipeline = useTablePipeline<T>({
    pipeline: extraPipeline,
    use: [selection(rowSelection)],
  })

  return (
    <Table
      {...rest}
      pipeline={pipeline}
      rootClassName={clsx(`virtual-table-${size}`)}
      ref={ref}
      estimatedRowHeight={estimatedRowHeight}
      stickyHeader={typeof sticky === 'boolean' ? sticky : sticky?.offsetHeader}
    />
  )
}

export default forwardRef(VirtualTable) as <T>(
  props: VirtualTableProps<T> & RefAttributes<VirtualTableCoreRef>,
) => ReactElement
