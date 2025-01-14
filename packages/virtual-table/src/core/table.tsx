import type { CSSProperties, ForwardedRef, ReactElement, RefAttributes } from 'react'
import type { TableBodyProps } from './body'
import type { ContainerSizeState } from './context/container-size'
import type { TableSharedContextType } from './context/shared'
import type { RowRect, UseRowRectManagerOptions } from './hooks/useRowRectManager'
import type { OnRowType } from './types'
import clsx from 'clsx'
import {
  forwardRef,
  memo,
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
import TableBody from './body'
import { ContainerSize } from './context/container-size'
import { HorizontalScrollContext } from './context/horizontal-scroll'
import { TableShared } from './context/shared'
import { TableColumnsContext } from './context/table-columns'
import TableHeader from './header'
import { useCalcSize } from './hooks/useCalcSize'
import { anchorQuery, useRowRectManager } from './hooks/useRowRectManager'
import { pipelineRender } from './pipeline/render-pipeline'
import { TablePipeline } from './pipeline/useTablePipeline'
import TableRoot from './root'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

export type VirtualTableCoreRef = HTMLTableElement

export interface VirtualTableCoreProps<T>
  extends Pick<UseRowRectManagerOptions, 'estimatedRowHeight'>,
  Omit<
    TableBodyProps<T>,
    | 'startIndex'
    | 'rowComponent'
    | 'bodyRender'
    | 'rowPipelineRender'
    | 'cellPipelineRender'
  > {
  tableBodyClassName?: string
  tableBodyStyle?: CSSProperties

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
    className,
    style,
    tableBodyClassName,
    tableBodyStyle,
    columns: rawColumns,
    dataSource: rawData,
    rowKey: rawRowKey = 'key',
    estimatedRowHeight,
    overscanCount = 5,
    stickyHeader,
    pipeline = (TablePipeline.defaultPipeline as TablePipeline<T>),
    rowClassName: rawRowClassName,
    onRow,
  } = props

  const tableNode = useRef<HTMLTableElement>(null)
  const rootNode = useRef<HTMLDivElement>(null)
  const scrollerContainerRef = useRef<HTMLElement | null>(null)

  const getScroller = useCallback(() => {
    const root = rootNode.current
    if (root == null) return
    return getScrollParent(root)
  }, [])

  const {
    scrollContainerHeight,
    scrollContainerWidth,
    tableHeight,
    tableWidth,
  } = useCalcSize({ getScroller, root: rootNode })

  const containerSize = useMemo((): ContainerSizeState => {
    return {
      width: scrollContainerWidth,
      height: scrollContainerHeight,
      tableWidth,
      tableHeight,
      container() {
        return scrollerContainerRef.current
      },
    }
  }, [scrollContainerWidth, scrollContainerHeight, tableWidth, tableHeight])

  // 滚动容器内可见数据条数
  const visibleCount = useRef(0)
  const containerHeightRef = useRef(0)

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const {
    dataSource,
    columns,
    rowKey,
    rowClassName,

    render,
    renderRoot,
    renderContent,
    renderHeaderWrapper,
    renderHeaderRoot,
    renderHeader,
    renderHeaderRow,
    renderHeaderCell,
    renderBodyWrapper,
    renderBodyRoot,
    renderBody,
    renderRow,
    renderCell,

    onRow: onPipelineRow,
  } = pipeline.use({
    dataSource: rawData,
    rowKey: rawRowKey,
    columns: rawColumns,
    visibleCount: endIndex - startIndex,
  })

  const onRowClassName = useCallback((record: T, index: number) => {
    return clsx(rawRowClassName?.(record, index), rowClassName?.(record, index))
  }, [rawRowClassName, rowClassName])

  const onRowProps: OnRowType<T> = useCallback((record, index) => {
    return { ...onRow?.(record, index), ...onPipelineRow?.(record, index) }
  }, [onPipelineRow, onRow])

  const dataSlice = useMemo(() => {
    return (dataSource ?? []).slice(startIndex, endIndex)
  }, [dataSource, startIndex, endIndex])

  const hasData = dataSource == null ? false : dataSource.length > 0

  // 初始化时根据滚动容器计算 visibleCount
  useLayoutEffect(() => {
    const scrollerContainer = getScroller()
    if (scrollerContainer == null) return
    let containerHeight = 0
    let scrollTop = 0
    if (isWindow(scrollerContainer) || isRoot(scrollerContainer)) {
      containerHeight = window.innerHeight
      scrollTop = window.scrollY
    } else {
      const element = getScrollElement(scrollerContainer)
      containerHeight = element.getBoundingClientRect().height
      scrollTop = element.scrollTop
    }
    const count = Math.ceil(containerHeight / estimatedRowHeight)

    if (visibleCount.current === 0) {
      // 判断一下当前滚动位置，计算 startIndex（场景：SPA 页面切换且渲染非异步数据）
      let nextStartIndex = 0
      if (scrollTop >= estimatedRowHeight) {
        nextStartIndex = Math.max(Math.floor(scrollTop / estimatedRowHeight) - 1 - overscanCount, 0)
      }
      setStartIndex(nextStartIndex)
      setEndIndex(nextStartIndex + count + overscanCount)
    }

    containerHeightRef.current = containerHeight
    visibleCount.current = count
  }, [estimatedRowHeight, getScroller, hasData, overscanCount])

  const scrollTopRef = useRef(0)

  // 锚点元素，当前虚拟列表中，最接近滚动容器顶部的元素
  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimatedRowHeight,
    top: 0,
    bottom: estimatedRowHeight,
  })

  const {
    rowHeightList,
    rects,
    updateRowHeight,
    sum,
  } = useRowRectManager({
    itemCount: dataSource?.length ?? 0,
    estimatedRowHeight,
    onChange(index, _height, rowRects) {
      if (anchorRef.current.index === index) {
        anchorRef.current = rowRects[index]
      }
    },
  })

  useEffect(() => {
    const container = getScroller()
    if (container == null) return

    const updateBoundary = (scrollTop: number) => {
      const anchor = anchorQuery(rects(), scrollTop)
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
  }, [getScroller, overscanCount, rects])

  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)
  const hasFixedLeftColumn = columns.some((x) => isValidFixedLeft(x.fixed))
  const hasFixedRightColumn = columns.some((x) => isValidFixedRight(x.fixed))

  const shared = useMemo(() => {
    return {
      getRowHeightList() {
        return rowHeightList.current
      },
      updateRowHeight,
    } satisfies TableSharedContextType
  }, [rowHeightList, updateRowHeight])

  const contentNode = pipelineRender(
    <>
      <TableHeader
        columns={columns}
        stickyHeader={stickyHeader}
        renderHeaderWrapper={renderHeaderWrapper}
        renderHeaderRoot={renderHeaderRoot}
        renderHeader={renderHeader}
        renderHeaderRow={renderHeaderRow}
        renderHeaderCell={renderHeaderCell}
      />
      <TableBody
        tableRef={composeRef(tableNode, ref)}
        className={tableBodyClassName}
        style={{
          ...tableBodyStyle,
          paddingBottom: bottomBlank,
          paddingTop: topBlank,
        }}
        columns={columns}
        rowKey={rowKey}
        dataSource={dataSlice}
        startIndex={startIndex}
        rowClassName={onRowClassName}
        onRow={onRowProps}
        renderBodyWrapper={renderBodyWrapper}
        renderBodyRoot={renderBodyRoot}
        renderBody={renderBody}
        renderRow={renderRow}
        renderCell={renderCell}
      />
    </>,
    renderContent,
    { columns },
  )

  const table = pipelineRender(
    <TableRoot
      ref={rootNode}
      className={className}
      style={style}
      hasFixedLeftColumn={hasFixedLeftColumn}
      hasFixedRightColumn={hasFixedRightColumn}
      renderRoot={renderRoot}
    >
      {contentNode}
    </TableRoot>,
    render,
    { columns },
  )

  return (
    <TableShared.Provider value={shared}>
      <TableColumnsContext columns={columns}>
        <ContainerSize.Provider value={containerSize}>
          <HorizontalScrollContext>{table}</HorizontalScrollContext>
        </ContainerSize.Provider>
      </TableColumnsContext>
    </TableShared.Provider>
  )
}

if (__DEV__) {
  VirtualTableCore.displayName = 'VirtualTable.Core'
}

export default memo(forwardRef(VirtualTableCore)) as <T>(
  props: VirtualTableCoreProps<T> & RefAttributes<HTMLTableElement>,
) => ReactElement
