/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-layout-effect */
import clsx from 'classnames'
import {
  type CSSProperties,
  type DetailedHTMLProps,
  type ForwardedRef,
  forwardRef,
  type Key,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type TableHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { __DEV__ } from '../utils/dev'
import { getScrollElement, getScrollParent, isRoot, isWindow } from '../utils/dom'
import { composeRef } from '../utils/ref'
import TableBody, { type TableBodyProps } from './body'
import { TableShared, type TableSharedContextType } from './context/shared'
import { TableColumnsContext } from './context/table-columns'
import TableHeader from './header'
import {
  type RowRect,
  useRowRectManager,
  type UseRowRectManagerOptions,
} from './hooks/useRowRectManager'
import { TablePipeline } from './hooks/useTablePipeline'
import TableRoot from './root'
import { type OnRowType } from './types'
import { pipelineRender } from './utils/render-pipeline'

type DefaultTableProps = DetailedHTMLProps<
  TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>

export type VirtualTableCoreRef = HTMLTableElement

export interface VirtualTableCoreProps<T>
  extends Omit<DefaultTableProps, 'children'>,
    Pick<UseRowRectManagerOptions, 'estimatedRowHeight'>,
    Omit<
      TableBodyProps<T>,
      | 'startIndex'
      | 'rowComponent'
      | 'bodyRender'
      | 'rowPipelineRender'
      | 'cellPipelineRender'
    > {
  rootClassName?: string
  rootStyle?: CSSProperties

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  /** 在头和尾额外渲染多少条 @default 5 */
  overscanCount?: number

  pipeline?: TablePipeline<T>
}

function VirtualTableCore<T>(
  props: VirtualTableCoreProps<T>,
  ref: ForwardedRef<VirtualTableCoreRef>,
) {
  const {
    rootClassName,
    rootStyle,
    className,
    style,
    columns: rawColumns,
    dataSource: rawData,
    rowKey: rawRowKey = 'key',
    estimatedRowHeight,
    overscanCount = 5,
    stickyHeader,
    pipeline = TablePipeline.defaultPipeline as TablePipeline<T>,
    rowClassName: rawRowClassName,
    onRow,
    ...rest
  } = props

  const {
    dataSource,
    columns,
    rowKey,
    rowClassName,

    render,
    renderBody,
    renderRow,
    renderCell,
    renderHeader,
    renderHeaderCell,

    onRow: onPipelineRow,
  } = pipeline.use({
    dataSource: rawData,
    rowKey: rawRowKey,
    columns: rawColumns,
  })

  const onRowClassName = useCallback(
    (record: T, index: number) => {
      return clsx(rawRowClassName?.(record, index), rowClassName?.(record, index))
    },
    [rawRowClassName, rowClassName],
  )

  const onRowProps: OnRowType = useCallback(
    (record, index) => {
      return { ...onRow?.(record, index), ...onPipelineRow?.(record, index) }
    },
    [onPipelineRow, onRow],
  )

  const tableNode = useRef<HTMLTableElement>(null)
  const { rowHeightList, rects, updateRowHeight, sum } = useRowRectManager({
    itemCount: dataSource?.length ?? 0,
    estimatedRowHeight,
  })

  // 滚动容器内可见数据条数
  const visibleCount = useRef(0)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const dataSlice = useMemo(() => {
    return (dataSource ?? [])?.slice(startIndex, endIndex)
  }, [dataSource, startIndex, endIndex])

  const hasData = dataSource == null ? false : dataSource.length > 0

  // 初始化时根据滚动容器计算 visibleCount
  useLayoutEffect(() => {
    const container = tableNode.current
    if (container == null) return

    const scrollerContainer = getScrollParent(container)
    let containerHeight = 0
    if (isWindow(scrollerContainer) || isRoot(scrollerContainer)) {
      containerHeight = window.innerHeight
    } else {
      containerHeight = getScrollElement(scrollerContainer).getBoundingClientRect().height
    }
    const count = Math.ceil(containerHeight / estimatedRowHeight)

    if (visibleCount.current === 0) {
      const nextStartIndex = 0
      setStartIndex(nextStartIndex)
      setEndIndex(nextStartIndex + count + overscanCount)
    }

    visibleCount.current = count
  }, [estimatedRowHeight, hasData, overscanCount])

  const scrollTopRef = useRef(0)

  // 锚点元素，当前虚拟列表中，最接近滚动容器顶部的元素
  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimatedRowHeight,
    top: 0,
    bottom: estimatedRowHeight,
  })

  useEffect(() => {
    const node = tableNode.current
    if (node == null) return
    const container = getScrollParent(node)

    const updateBoundary = (scrollTop: number) => {
      // TODO: 考虑二分法查找；未判断滚动方向，这可能是导致向上滚动白屏的原因
      const anchor = rects().find((x) => x.bottom > scrollTop)
      if (anchor != null) {
        anchorRef.current = anchor
        setStartIndex(Math.max(0, anchor.index - overscanCount))
        setEndIndex(anchor.index + visibleCount.current + overscanCount)
      }
    }

    const onScroll = (e: Event) => {
      const scrollElement = getScrollElement(e.target)
      const { scrollTop } = scrollElement

      // 如果滚动距离比较小，没有超出锚点元素的边界，就不需要计算 startIndex、endIndex 了
      // 向下滚动
      if (scrollTop > scrollTopRef.current) {
        if (scrollTop > anchorRef.current.bottom) {
          updateBoundary(scrollTop)
        }
      } else if (scrollTop < scrollTopRef.current) {
        // 向上滚动
        if (scrollTop < anchorRef.current.top) {
          updateBoundary(scrollTop)
        }
      }

      scrollTopRef.current = scrollTop
    }
    container.addEventListener('scroll', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [overscanCount, rects])

  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)
  const hasFixedLeftColumn = columns.some((x) => x.fixed === 'left')
  const hasFixedRightColumn = columns.some((x) => x.fixed === 'right')

  const shared = useMemo(() => {
    return {
      getRowHeightList() {
        return rowHeightList.current
      },
      updateRowHeight,
    } satisfies TableSharedContextType
  }, [rowHeightList, updateRowHeight])

  const table: ReactNode = (
    <TableRoot
      className={rootClassName}
      style={rootStyle}
      hasFixedLeftColumn={hasFixedLeftColumn}
      hasFixedRightColumn={hasFixedRightColumn}
    >
      <TableHeader
        columns={columns}
        stickyHeader={stickyHeader}
        headerRender={renderHeader}
        cellRender={renderHeaderCell}
      />
      <table
        {...rest}
        className={clsx(className, 'virtual-table-body')}
        style={{ ...style, paddingBottom: bottomBlank, paddingTop: topBlank }}
        ref={composeRef(tableNode, ref)}
      >
        <colgroup>
          {columns.map((item, index) => {
            const key = 'key' in item ? (item.key as Key) : item.dataIndex
            return (
              <col
                key={typeof key === 'symbol' ? index : key}
                style={{
                  width: item.width,
                  minWidth: item.minWidth,
                }}
              />
            )
          })}
        </colgroup>
        <TableBody
          columns={columns}
          rowKey={rowKey}
          dataSource={dataSlice}
          startIndex={startIndex}
          rowClassName={onRowClassName}
          onRow={onRowProps}
          bodyRender={renderBody}
          rowPipelineRender={renderRow}
          cellPipelineRender={renderCell}
        />
      </table>
    </TableRoot>
  )

  return (
    <TableShared.Provider value={shared}>
      <TableColumnsContext columns={columns}>
        {pipelineRender(table, render, { columns })}
      </TableColumnsContext>
    </TableShared.Provider>
  )
}

if (__DEV__) {
  VirtualTableCore.displayName = 'VirtualTable.Core'
}

export default forwardRef(VirtualTableCore) as <T>(
  props: VirtualTableCoreProps<T> & RefAttributes<HTMLTableElement>,
) => ReactElement
