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
import { useCallback, useMemo } from 'react'
import { useMergedRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useScrollSynchronize } from './context/horizontal-scroll'
import { TableRowManager } from './context/row-manager'
import { useNodeHeight } from './hooks/useNodeHeight'
import { NormalRowHeightKey, useRowVirtualize } from './hooks/useRowVirtualize'
import { pipelineRender } from './pipeline/render-pipeline'
import Row from './row'
import { getRowKey } from './utils/get-key'

export interface TableBodyProps<T>
  extends Omit<NecessaryProps<T>, 'columns'>,
  Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  debugKey?: string
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
    debugKey,
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

  const [tbodyNode, nodeHeightValid] = useNodeHeight()

  const {
    startIndex,
    endIndex,
    dataSlice: dataSource,
    rowHeightByRowKeyRef,
    setRowHeightByRowKey,
    rowHeightList,
    topBlank,
    bottomBlank,
  } = useRowVirtualize({
    debugKey,
    nodeHeightValid,
    getOffsetTop,
    rowKey,
    dataSource: rawData,
    getScroller,
    estimateSize,
    overscan,
  })

  instance.extend({
    getRowVirtualizeState: () => ({ startIndex, endIndex, overscan, estimateSize }),
    getRowHeightMap: () => rowHeightByRowKeyRef.current,
  } satisfies Partial<TableInstanceBuildIn>)

  const tbodyRef = useMergedRef(bodyRef, tbodyNode)

  // 测量行高
  const onMeasureRowHeight = useCallback((args: OnRefCallbackArgs<T>) => {
    const { node, rowKey } = args
    setRowHeightByRowKey(rowKey, NormalRowHeightKey, () => {
      if (node == null) return
      return node.offsetHeight
    })
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

  const wrapperRef = useScrollSynchronize('virtual-table-body')
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

      const targetScrollTop = rowHeightList.slice(0, index).reduce((a, b) => a + b, 0)
      return targetScrollTop + getOffsetTop() + offset
    },
    scrollToRow(index, behavior) {
      instance.scrollTo({ top: instance.getScrollValueByRowIndex(index), behavior })
    },
  } satisfies Partial<TableInstanceBuildIn>)

  const rowManageState = useMemo<TableRowManagerContextType>(() => {
    return {
      getRowHeightList: () => rowHeightList,
      setRowHeightByRowKey,
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
