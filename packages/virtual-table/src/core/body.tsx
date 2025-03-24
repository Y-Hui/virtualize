import type { CSSProperties, Key, Ref } from 'react'
import type { ScrollElement } from '../utils/dom'
import type { TableRowManagerContextType } from './context/row-manager'
import type { NecessaryProps } from './internal'
import type {
  MiddlewareRenderBody,
  MiddlewareRenderBodyRoot,
  MiddlewareRenderBodyWrapper,
} from './pipeline/types'
import type { RowProps } from './row'
import type { AnyObject, InnerColumnDescriptor } from './types'
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

export interface TableBodyProps<T>
  extends Omit<NecessaryProps<T>, 'columns'>,
  Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  className?: string
  style?: CSSProperties
  columns: InnerColumnDescriptor<T>
  bodyWrapperRef?: Ref<HTMLDivElement>
  bodyRootRef?: Ref<HTMLTableElement>
  bodyRef?: Ref<HTMLTableSectionElement>
  overscan: number
  estimateSize: number
  getOffsetTop: () => number
  getScroller: () => ScrollElement | undefined
  rowClassName?: (record: T, index: number) => string
  renderBodyWrapper?: MiddlewareRenderBodyWrapper
  renderBodyRoot?: MiddlewareRenderBodyRoot
  renderBody?: MiddlewareRenderBody
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

    overscan,
    estimateSize,

    getScroller,
    getOffsetTop,

    rowClassName,
    onRow,
    renderBodyWrapper,
    renderBodyRoot,
    renderBody,
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

  const bodyNode = pipelineRender(
    <tbody ref={tbodyRef}>
      {dataSource.map((e, rowIndex) => {
        const _rowKey = (e as AnyObject)[rowKey as string]
        return (
          <Row
            key={_rowKey}
            className={clsx(rowClassName?.(e, rowIndex))}
            rowIndex={rowIndex + startIndex}
            rowData={e}
            columns={columnDescriptor}
            onRow={onRow}
            renderRow={renderRow}
            renderCell={renderCell}
          />
        )
      })}
    </tbody>,
    renderBody,
    { columns, columnDescriptor: descriptor },
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
    { columns, columnDescriptor: descriptor },
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
        { columns, columnDescriptor: descriptor },
      )}
    </TableRowManager.Provider>
  )
}

export default TableBody
