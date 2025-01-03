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
import { columnResize } from './middleware/column-resize'
import { tableEmpty } from './middleware/empty'
import { type ExpandableConfig, tableExpandable } from './middleware/expandable'
import { horizontalScrollBar } from './middleware/horizontal-scroll-bar'
import { tableLoading } from './middleware/loading'
import { selection, type TableRowSelection } from './middleware/selection'
import { tableSummary, type TableSummaryOptions } from './middleware/summary'
import { type SizeType } from './types'

export interface VirtualTableProps<T>
  extends Omit<
    VirtualTableCoreProps<T>,
      'estimatedRowHeight' | 'stickyHeader' | 'summary'
  >,
  Partial<TableSummaryOptions<T>> {
  size?: SizeType
  bordered?: boolean
  loading?: boolean
  /** 预计每行高度 */
  estimatedRowHeight?: number
  sticky?: boolean | { offsetHeader: number }
  rowSelection?: TableRowSelection<T>
  expandable?: ExpandableConfig<T>
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
    className,
    size = 'middle',
    estimatedRowHeight: rowHeight,
    sticky,
    rowSelection,
    loading,
    bordered,
    pipeline: extraPipeline,
    expandable,
    summary,
    ...rest
  } = props

  const estimatedRowHeight = getDefaultEstimatedRowHeight(size, rowHeight)

  const pipeline = useTablePipeline<T>({
    pipeline: extraPipeline,
    use: [
      selection(rowSelection),
      tableExpandable(expandable),
      columnResize(),
      tableEmpty(),
      tableSummary(summary == null ? undefined : { summary }),
      horizontalScrollBar(),
      tableLoading({ loading }),
    ],
  })

  return (
    <Table
      {...rest}
      pipeline={pipeline}
      className={clsx(
        `virtual-table-${size}`,
        bordered && 'virtual-table-bordered',
        className,
      )}
      ref={ref}
      estimatedRowHeight={estimatedRowHeight}
      stickyHeader={typeof sticky === 'boolean' ? sticky : sticky?.offsetHeader}
    />
  )
}

export default forwardRef(VirtualTable) as <T>(
  props: VirtualTableProps<T> & RefAttributes<VirtualTableCoreRef>,
) => ReactElement
