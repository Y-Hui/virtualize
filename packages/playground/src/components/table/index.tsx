import '@are-visual/virtual-table/styles/table.scss'
import '@are-visual/virtual-table/middleware/column-resize/styles.scss'
import '@are-visual/virtual-table/middleware/expandable/styles.scss'
import '@are-visual/virtual-table/middleware/horizontal-scroll-bar/styles.scss'
import '@are-visual/virtual-table/middleware/loading/styles.scss'
import '@are-visual/virtual-table/middleware/selection/styles.scss'
import '@are-visual/virtual-table/middleware/summary/styles.scss'
import './sizes.scss'

import type {
  ColumnExtra,
  ColumnType,
  VirtualTableProps as VirtualTableCoreProps,
} from '@are-visual/virtual-table'
import type { ExpandableConfig } from '@are-visual/virtual-table/middleware/expandable'
import type { TableSummaryOptions } from '@are-visual/virtual-table/middleware/summary'
import type { ForwardedRef, ReactElement, RefAttributes } from 'react'
import type { TablePaginationConfig } from './middleware/pagination'
import type { TableRowSelection } from './middleware/selection'
import { VirtualTable as Table, useTablePipeline } from '@are-visual/virtual-table'
import { columnResize } from '@are-visual/virtual-table/middleware/column-resize'
import { tableEmpty } from '@are-visual/virtual-table/middleware/empty'
import { tableExpandable } from '@are-visual/virtual-table/middleware/expandable'
import { horizontalScrollBar } from '@are-visual/virtual-table/middleware/horizontal-scroll-bar'
import { tableLoading } from '@are-visual/virtual-table/middleware/loading'
import { Summary, tableSummary } from '@are-visual/virtual-table/middleware/summary'
import { Empty } from 'antd'
import clsx from 'clsx'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { tablePagination } from './middleware/pagination'
import { tableSelection } from './middleware/selection'

export type { ColumnType, ExpandableConfig, TableRowSelection, TableSummaryOptions }

export type SizeType = 'small' | 'middle' | 'large'

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
  scrollBarBottom?: number | string
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

const extraColumnProps: ColumnExtra = { disableResize: true }

function VirtualTable<T>(
  props: VirtualTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
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
    pagination = false,
    onChange,
    storageKey,
    scrollBarBottom,
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
      tableSelection(rowSelection == null ? undefined : { ...rowSelection, extraColumnProps }),
      tableExpandable(expandable),
      columnResize(storageKey == null ? undefined : { storageKey }),
      // eslint-disable-next-line react-compiler/react-compiler
      tablePagination(pagination === false ? false : { ...pagination, onChange: onPaginationChange }),
      { priority: 200, hook: tableLoading({ loading }) },
      { priority: 200, hook: tableEmpty({ children: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }) },
      { priority: 200, hook: tableSummary(summary == null ? undefined : { summary }) },
      { priority: 200, hook: horizontalScrollBar({ bottom: scrollBarBottom }) },
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
  props: VirtualTableProps<T> & RefAttributes<HTMLDivElement>,
) => ReactElement
