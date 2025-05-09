import type { CSSProperties, Ref } from 'react'
import type { ScrollElement } from '../utils/dom'
import type { TableRowManagerContextType } from './context/row-manager'
import type { NecessaryProps } from './internal'
import type {
  MiddlewareRenderBody,
  MiddlewareRenderBodyContent,
  MiddlewareRenderBodyRoot,
  MiddlewareRenderBodyWrapper,
} from './pipeline/types'
import type { OnRefCallbackArgs, RowProps } from './row'
import type { InnerColumnDescriptor, TableInstance, TableInstanceBuildIn } from './types'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useMergedRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { TableRowManager } from './context/row-manager'
import { NormalRowHeightKey, useRowVirtualize } from './hooks/useRowVirtualize'
import { pipelineRender } from './pipeline/render-pipeline'
import Row from './row'
import { getRowKey } from './utils/get-key'

export interface TableBodyProps<T>
  extends Omit<NecessaryProps<T>, 'columns'>,
  Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  className?: string
  style?: CSSProperties
  defaultColumnWidth: number
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
    defaultColumnWidth,
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
    endIndex,
    dataSlice: dataSource,
    rowHeightByRowKey,
    setRowHeightByRowKey,
    flushLayout,
    rowHeightList,
    topBlank,
    bottomBlank,
  } = useRowVirtualize({
    getOffsetTop,
    rowKey,
    dataSource: rawData,
    getScroller,
    estimateSize,
    overscan,
  })

  instance.extend({
    getRowVirtualizeState: () => ({ startIndex, endIndex, overscan, estimateSize }),
    getRowHeightMap: () => rowHeightByRowKey.current,
  } satisfies Partial<TableInstanceBuildIn>)

  const tbodyRef = useMergedRef(bodyRef, (elm) => {
    if (elm == null) return

    const bodyHeight = elm.offsetHeight
    if (bodyHeight === 0) return

    // body 的 ref 回调函数中，说明 body 渲染完成，也就意味着所有的 tr 也已经渲染完成，
    // 现在可以记录所有 tr 的高度
    flushLayout()
  })

  // 测量行高
  const onMeasureRowHeight = useCallback((args: OnRefCallbackArgs<T>) => {
    const { node, rowKey } = args
    if (node == null) return
    // 小心陷阱：当 table 父元素为 display: none 时，依然会触发，并设置高度为 0
    setRowHeightByRowKey(rowKey, NormalRowHeightKey, node.offsetHeight)
  }, [setRowHeightByRowKey])

  const { columns, descriptor } = columnDescriptor

  const bodyContent = pipelineRender(dataSource.map((e, rowIndex) => {
    const key = getRowKey(e, rowKey)
    return (
      <Row
        key={key}
        className={clsx(rowClassName?.(e, rowIndex))}
        rowKey={key}
        rowIndex={rowIndex + startIndex}
        rowData={e}
        columns={columnDescriptor}
        onRow={onRow}
        renderRow={renderRow}
        renderCell={renderCell}
        onRefCallback={onMeasureRowHeight}
      />
    )
  }), renderBodyContent, { columns, columnDescriptor: descriptor, startRowIndex: startIndex })

  const bodyNode = pipelineRender(
    <tbody ref={tbodyRef}>{bodyContent}</tbody>,
    renderBody,
    { columns, columnDescriptor: descriptor, startRowIndex: startIndex },
  )

  const tableNode = pipelineRender(
    <table
      className={clsx(className, 'virtual-table-body')}
      style={{ ...style, paddingBottom: bottomBlank, paddingTop: topBlank }}
      ref={bodyRootRef}
    >
      <Colgroup
        columns={descriptor}
        defaultColumnWidth={defaultColumnWidth}
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

  // 滚动到指定行。注意：如果 estimatedRowHeight 不够准确时，不一定能准确滚动到目标位置
  instance.extend({
    getScrollValueByRowIndex(index) {
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
    },
    scrollToRow(index, behavior) {
      instance.scrollTo({ top: instance.getScrollValueByRowIndex(index), behavior })
    },
  } satisfies Partial<TableInstanceBuildIn>)

  const rowManageState = useMemo<TableRowManagerContextType>(() => {
    return {
      setRowHeightByRowKey,
      getRowHeightList: () => rowHeightList.current,
    }
  }, [rowHeightList, setRowHeightByRowKey])

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
