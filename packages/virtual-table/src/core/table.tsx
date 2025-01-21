import type { CSSProperties, ForwardedRef, ReactElement, Ref, RefAttributes } from 'react'
import type { TableBodyProps } from './body'
import type { ContainerSizeState } from './context/container-size'
import type { TableSharedContextType } from './context/shared'
import type { UseRowRectManagerOptions } from './hooks/useRowRectManager'
import type { NecessaryProps } from './internal'
import type { OnRowType } from './types'
import clsx from 'clsx'
import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { getScrollParent } from '../utils/dom'
import { useMergedRef } from '../utils/ref'
import TableBody from './body'
import { ContainerSize } from './context/container-size'
import { HorizontalScrollContext } from './context/horizontal-scroll'
import { TableShared } from './context/shared'
import { TableColumnsContext } from './context/table-columns'
import TableHeader from './header'
import { useCalcSize } from './hooks/useCalcSize'
import { useRowVirtualize } from './hooks/useRowVirtualize'
import { useVisibleRowSize } from './hooks/useVisibleRowSize'
import { pipelineRender } from './pipeline/render-pipeline'
import { TablePipeline } from './pipeline/useTablePipeline'
import TableRoot from './root'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

export interface VirtualTableCoreProps<T>
  extends NecessaryProps<T>,
  Pick<UseRowRectManagerOptions, 'estimatedRowHeight'>,
  Pick<TableBodyProps<T>, 'rowClassName' | 'onRow'> {
  tableBodyRef?: Ref<HTMLTableElement>

  className?: string
  style?: CSSProperties

  tableBodyClassName?: string
  tableBodyStyle?: CSSProperties

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  /** 在头和尾额外渲染多少行 @default 5 */
  overscanRows?: number

  pipeline?: TablePipeline<T>

  getOffsetTop?: () => number
}

function VirtualTableCore<T>(
  props: VirtualTableCoreProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const {
    tableBodyRef,
    className,
    style,
    tableBodyClassName,
    tableBodyStyle,
    columns: rawColumns,
    dataSource: rawData,
    rowKey: rawRowKey = 'key',
    estimatedRowHeight,
    overscanRows = 5,
    stickyHeader,
    pipeline = (TablePipeline.defaultPipeline as TablePipeline<T>),
    rowClassName: rawRowClassName,
    onRow,
    getOffsetTop: getOffsetTopImpl,
  } = props

  const rootNode = useRef<HTMLDivElement>(null)
  const bodyNode = useRef<HTMLTableElement>(null)

  const getScroller = useCallback(() => {
    const root = rootNode.current
    if (root == null) return
    return getScrollParent(root)
  }, [])

  const getOffsetTop = useCallback(() => {
    if (typeof getOffsetTopImpl === 'function') {
      return getOffsetTopImpl()
    }
    return rootNode.current?.offsetTop ?? 0
  }, [getOffsetTopImpl])

  const hasData = !Array.isArray(rawData) ? false : rawData.length > 0

  const [
    [startIndex, setStartIndex],
    [endIndex, setEndIndex],
    { visibleRowSize },
  ] = useVisibleRowSize({
    hasData,
    getScroller,
    estimatedRowHeight,
    overscan: overscanRows,
  })

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
    visibleRowSize: endIndex - startIndex,
    estimatedRowHeight,
    bodyRef: bodyNode,
    rootRef: rootNode,
    getOffsetTop,
    getScroller,
  })

  const {
    dataSlice,
    updateRowHeight,
    rowHeightList,
    topBlank,
    bottomBlank,
  } = useRowVirtualize({
    getOffsetTop,
    startIndex,
    setStartIndex,
    endIndex,
    setEndIndex,
    dataSource,
    getScroller,
    estimatedRowHeight,
    overscan: overscanRows,
    visibleRowSize,
  })

  const onRowClassName = useCallback((record: T, index: number) => {
    return clsx(rawRowClassName?.(record, index), rowClassName?.(record, index))
  }, [rawRowClassName, rowClassName])

  const onRowProps: OnRowType<T> = useCallback((record, index) => {
    return { ...onRow?.(record, index), ...onPipelineRow?.(record, index) }
  }, [onPipelineRow, onRow])

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

  const bodyMergedRef = useMergedRef(bodyNode, tableBodyRef)
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
        tableRef={bodyMergedRef}
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

  const rootMergedRef = useMergedRef(rootNode, ref)
  const table = pipelineRender(
    <TableRoot
      ref={rootMergedRef}
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
  props: VirtualTableCoreProps<T> & RefAttributes<HTMLDivElement>,
) => ReactElement
