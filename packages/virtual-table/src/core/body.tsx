import type { CSSProperties, Key, Ref } from 'react'
import type { ScrollElement } from '../utils/dom'
import type { TableRowManagerContextType } from './context/row-manager'
import type { InternalInstance } from './hooks/useTableInstance'
import type { NecessaryProps } from './internal'
import type {
  MiddlewareRenderBody,
  MiddlewareRenderBodyContent,
  MiddlewareRenderBodyRoot,
  MiddlewareRenderBodyWrapper,
} from './pipeline/types'
import type { RowProps } from './row'
import type { InnerColumnDescriptor, TableInstance } from './types'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useMergedRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useColumnSizes } from './context/column-sizes'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { TableRowManager } from './context/row-manager'
import { useRowVirtualize } from './hooks/useRowVirtualize'
import { pipelineRender } from './pipeline/render-pipeline'
import Row from './row'
import { getRowKey } from './utils/get-key'

export interface TableBodyProps<T>
  extends Omit<NecessaryProps<T>, 'columns'>,
  Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  className?: string
  style?: CSSProperties
  columns: InnerColumnDescriptor<T>
  bodyWrapperRef?: Ref<HTMLDivElement>
  bodyRootRef?: Ref<HTMLTableElement>
  bodyRef?: Ref<HTMLTableSectionElement>
  instance: TableInstance
  overscan: number
  estimateSize: number
  getOffsetTop: () => number
  getScroller: () => ScrollElement | undefined
  rowClassName?: (record: T, index: number) => string
  renderBodyWrapper?: MiddlewareRenderBodyWrapper
  renderBodyRoot?: MiddlewareRenderBodyRoot
  renderBody?: MiddlewareRenderBody
  renderBodyContent?: MiddlewareRenderBodyContent
}

function TableBody<T>(props: TableBodyProps<T>) {
  const {
    bodyWrapperRef,
    bodyRootRef,
    bodyRef,
    className,
    style,
    dataSource: rawData,
    columns: columnDescriptor,
    rowKey,

    instance,

    overscan,
    estimateSize,

    getScroller,
    getOffsetTop,

    rowClassName,
    onRow,
    renderBodyWrapper,
    renderBodyRoot,
    renderBody,
    renderBodyContent,
    renderRow,
    renderCell,
  } = props

  const {
    startIndex,
    dataSlice: dataSource,
    setRowHeight,
    updateRowRectList,
    rowHeightList,
    topBlank,
    bottomBlank,
  } = useRowVirtualize({
    getOffsetTop,
    dataSource: rawData,
    getScroller,
    estimateSize,
    overscan,
  })

  // Record<rowIndex, Map(rowHeight)>
  // 一个 Row 可能有多个行高。例如：默认情况下，只有一个行高，展开后，展开面板的高度也被认为是同一个 Row 的
  // 所以可展开时，行高有多个，所有行高之和，则为 Row 的高度
  // 行高之间使用唯一的 key 作为区分
  const rowHeights = useRef(new Map<number, Map<Key, number>>())

  // 更新行高。一般会在 body 渲染后、展开面板中调用
  const updateRowHeight = useCallback((index: number, key: Key, height: number) => {
    const target = rowHeights.current.get(index) ?? new Map<Key, number>()
    target.set(key, height)
    rowHeights.current.set(index, target)
  }, [])

  const rowManageState = useMemo<TableRowManagerContextType>(() => {
    return { updateRowHeight, getRowHeightList: () => rowHeightList.current }
  }, [rowHeightList, updateRowHeight])

  const { columns, descriptor } = columnDescriptor
  const tbodyRef = useMergedRef(bodyRef, (elm) => {
    if (elm == null) return

    const bodyHeight = elm.offsetHeight
    if (bodyHeight === 0) return

    // body 的 ref 回调函数中，说明 body 渲染完成，也就意味着所有的 tr 也已经渲染完成，
    // 现在可以获取 tr 的高度，记录准确行高
    const heights = rowHeights.current
    heights.forEach((row, rowIndex) => {
      const height = Array.from(row.values()).reduce((res, x) => res + x, 0)
      setRowHeight(rowIndex, height)
    })
    updateRowRectList()
    rowHeights.current.clear()
  })

  const bodyContent = pipelineRender(dataSource.map((e, rowIndex) => {
    const key = getRowKey(e, rowKey)
    return (
      <Row
        key={key}
        className={clsx(rowClassName?.(e, rowIndex))}
        rowIndex={rowIndex + startIndex}
        rowData={e}
        columns={columnDescriptor}
        onRow={onRow}
        renderRow={renderRow}
        renderCell={renderCell}
      />
    )
  }), renderBodyContent, { columns, columnDescriptor: descriptor, startRowIndex: startIndex })

  const bodyNode = pipelineRender(
    <tbody ref={tbodyRef}>{bodyContent}</tbody>,
    renderBody,
    { columns, columnDescriptor: descriptor, startRowIndex: startIndex },
  )

  const { setWidthList } = useColumnSizes()

  const tableNode = pipelineRender(
    <table
      className={clsx(className, 'virtual-table-body')}
      style={{ ...style, paddingBottom: bottomBlank, paddingTop: topBlank }}
      ref={bodyRootRef}
    >
      <Colgroup
        columns={descriptor}
        onColumnSizesMeasure={setWidthList}
      />
      {bodyNode}
    </table>,
    renderBodyRoot,
    { columns, columnDescriptor: descriptor, startRowIndex: startIndex },
  )

  const { listen, notify } = useHorizontalScrollContext()
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = wrapperRef.current
    if (node == null) return

    const key = 'virtual-table-body'
    const onScroll = () => {
      notify(key, { scrollLeft: () => node.scrollLeft, node })
    }
    const dispose = listen(key, (scrollLeft) => {
      node.scrollLeft = scrollLeft
    })
    node.addEventListener('scroll', onScroll)
    return () => {
      node.removeEventListener('scroll', onScroll)
      dispose()
    }
  }, [listen, notify])

  const mergedRef = useMergedRef(wrapperRef, bodyWrapperRef)

  const internalHook = (instance as InternalInstance).getInternalHooks()

  // 滚动到指定行。注意：如果 estimatedRowHeight 不够准确时，不一定能准确滚动到目标位置
  internalHook.implScrollValueByRowIndex((index) => {
    const scroller = getScroller()
    if (scroller == null) {
      return 0
    }

    const { stickyHeader } = instance.getCurrentProps()
    const { headerWrapper } = instance.getDOM()

    let offset = 0
    // 没有 sticky，就要计算 header 高度
    if (stickyHeader == null || stickyHeader === false) {
      const headerOffsetHeight = headerWrapper == null ? 0 : headerWrapper.offsetHeight
      offset = headerOffsetHeight
    } else {
      offset = Number.isFinite(stickyHeader) ? (stickyHeader as number) * -1 : 0
    }

    const targetScrollTop = rowHeightList.current.slice(0, index).reduce((a, b) => a + b, 0)
    return targetScrollTop + getOffsetTop() + offset
  })

  internalHook.implScrollToRow((index) => {
    instance.scrollTo({ top: instance.getScrollValueByRowIndex(index) })
  })

  return (
    <TableRowManager.Provider value={rowManageState}>
      {pipelineRender(
        <div
          ref={mergedRef}
          className="virtual-table-body-wrapper"
        >
          {tableNode}
        </div>,
        renderBodyWrapper,
        { columns, columnDescriptor: descriptor, startRowIndex: startIndex },
      )}
    </TableRowManager.Provider>
  )
}

export default TableBody
