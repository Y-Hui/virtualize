import 'virtual-table/src/styles/table.scss'

import type { ForwardedRef, ReactElement, RefAttributes } from 'react'
import type {
  ColumnType,
  SizeType,
  VirtualTableProps as VirtualTableCoreProps,
  VirtualTableRef as VirtualTableCoreRef,
} from 'virtual-table'
import type { ExpandableConfig } from 'virtual-table/src/middleware/expandable'
import type { TableSummaryOptions } from 'virtual-table/src/middleware/summary'
import type { TablePaginationConfig } from './middleware/pagination'
import type { TableRowSelection } from './middleware/selection'
import { Empty } from 'antd'
import clsx from 'clsx'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { VirtualTable as Table, useTablePipeline } from 'virtual-table'
import { columnResize } from 'virtual-table/src/middleware/column-resize'
import { tableEmpty } from 'virtual-table/src/middleware/empty'
import { tableExpandable } from 'virtual-table/src/middleware/expandable'
import { horizontalScrollBar } from 'virtual-table/src/middleware/horizontal-scroll-bar'
import { tableLoading } from 'virtual-table/src/middleware/loading'
import { tableSummary } from 'virtual-table/src/middleware/summary'
import Summary from 'virtual-table/src/middleware/summary/summary'
import { tablePagination } from './middleware/pagination'
import { tableSelection } from './middleware/selection'

export type { ColumnType, ExpandableConfig, TableRowSelection, TableSummaryOptions }
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
  storageKey?: string
  pagination?: false | TablePaginationConfig
  onChange?: (pagination: TablePaginationConfig) => void
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
    case 'middle':
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
    pagination,
    onChange,
    storageKey,
    ...rest
  } = props

  const paginationInfo = useRef<TablePaginationConfig>({})
  useEffect(() => {
    if (pagination != null && typeof pagination === 'object') {
      paginationInfo.current = {
        ...pagination,
        current: paginationInfo.current.current ?? pagination.current,
        pageSize: paginationInfo.current.pageSize ?? pagination.pageSize,
      }
    }
  }, [pagination])

  const onChangeEvent = useCallback(() => {
    onChange?.(paginationInfo.current)
  }, [onChange])

  const originPaginationChange = pagination === false ? undefined : pagination?.onChange
  const onPaginationChange = useCallback((current: number, pageSize: number) => {
    originPaginationChange?.(current, pageSize)
    paginationInfo.current = { ...paginationInfo.current, current, pageSize }
    onChangeEvent()
  }, [onChangeEvent, originPaginationChange])

  const pipeline = useTablePipeline<T>({
    pipeline: extraPipeline,
    use: [
      tableSelection(rowSelection),
      tableExpandable(expandable),
      columnResize(storageKey == null ? undefined : { storageKey }),
      // eslint-disable-next-line react-compiler/react-compiler
      tablePagination(pagination === false ? false : { ...pagination, onChange: onPaginationChange }),
      { priority: 200, hook: tableLoading({ loading }) },
      { priority: 200, hook: tableEmpty({ children: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }) },
      { priority: 200, hook: tableSummary(summary == null ? undefined : { summary }) },
      { priority: 200, hook: horizontalScrollBar() },
    ],
  })

  const estimatedRowHeight = getDefaultEstimatedRowHeight(size, rowHeight)

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

export { Summary }
export default forwardRef(VirtualTable) as <T>(
  props: VirtualTableProps<T> & RefAttributes<VirtualTableCoreRef>,
) => ReactElement
