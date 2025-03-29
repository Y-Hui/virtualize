import type { CSSProperties, ForwardedRef, Key, ReactElement, Ref, RefAttributes } from 'react'
import type { TableBodyProps } from './body'
import type { TableColumnsContextType } from './context/column-sizes'
import type { InternalInstance } from './hooks/useTableInstance'
import type { NecessaryProps } from './internal'
import type { ColumnDescriptor, OnRowType, TableInstance } from './types'
import clsx from 'clsx'
import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getRelativeOffsetTop, getScrollParent, isRoot, isWindow } from '../utils/dom'
import { useMergedRef } from '../utils/ref'
import TableBody from './body'
import { ColumnSizes } from './context/column-sizes'
import { ContainerSizeContext } from './context/container-size'
import { HorizontalScrollContext } from './context/horizontal-scroll'
import { StickyContext } from './context/sticky'
import TableHeader from './header'
import { useColumnVirtualize } from './hooks/useColumnVirtualize'
import { useTableInstance } from './hooks/useTableInstance'
import { pipelineRender } from './pipeline/render-pipeline'
import { TablePipeline } from './pipeline/useTablePipeline'
import TableRoot from './root'
import { getKey } from './utils/get-key'
import { isValidFixedLeft, isValidFixedRight } from './utils/verification'

export interface VirtualTableCoreProps<T>
  extends NecessaryProps<T>,
  Pick<TableBodyProps<T>, 'rowClassName' | 'onRow'> {
  bodyRootRef?: Ref<HTMLTableElement>
  instance?: TableInstance

  className?: string
  style?: CSSProperties

  tableBodyClassName?: string
  tableBodyStyle?: CSSProperties

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  /** 预计每列宽度，需要横向虚拟化时，设置它 */
  estimatedColumnWidth?: number
  /** 预计每行高度 @default 46 */
  estimatedRowHeight?: number
  /** 在头和尾额外渲染多少行 @default 5 */
  overscanRows?: number
  /** 横向虚拟化时，在头和尾额外渲染多少列 @default 3 */
  overscanColumns?: number

  /** 开启表头虚拟滚动 @default true */
  virtualHeader?: boolean

  /**
   * 缺失宽度设置时的默认值（与虚拟化无关）
   * @default 100
   */
  defaultColumnWidth?: number

  pipeline?: TablePipeline<T>

  getOffsetTop?: () => number
}

function VirtualTableCore<T>(
  props: VirtualTableCoreProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const {
    bodyRootRef,
    instance: rawInstance,
    className,
    style,
    tableBodyClassName,
    tableBodyStyle,
    columns: rawColumns,
    dataSource: rawData,
    rowKey: rawRowKey = 'key',
    estimatedRowHeight = 46,
    estimatedColumnWidth,
    overscanRows = 5,
    overscanColumns = 3,
    stickyHeader,
    defaultColumnWidth = 100,
    pipeline = (TablePipeline.defaultPipeline as TablePipeline<T>),
    rowClassName: rawRowClassName,
    onRow,
    getOffsetTop: getOffsetTopImpl,
    virtualHeader = true,
  } = props

  const instance = useTableInstance(rawInstance)

  const rootNode = useRef<HTMLDivElement>(null)
  const headerWrapperRef = useRef<HTMLDivElement>(null)
  const bodyWrapperRef = useRef<HTMLDivElement>(null)
  const bodyRoot = useRef<HTMLTableElement>(null)
  const mergedBodyRootRef = useMergedRef(bodyRoot, bodyRootRef)
  const bodyRef = useRef<HTMLTableSectionElement>(null)

  const getScroller = useCallback(() => {
    const root = rootNode.current
    if (root == null) return
    return getScrollParent(root)
  }, [])

  const getOffsetTop = useCallback(() => {
    if (typeof getOffsetTopImpl === 'function') {
      return getOffsetTopImpl()
    }
    const scrollContainer = getScroller()
    const root = rootNode.current
    if (root == null || scrollContainer == null || scrollContainer === root) {
      return 0
    }
    if (isWindow(scrollContainer) || isRoot(scrollContainer)) {
      const top = root.getBoundingClientRect().top
      return window.scrollY + top
    }
    return getRelativeOffsetTop(root, scrollContainer)
  }, [getOffsetTopImpl, getScroller])

  const {
    dataSource,
    columns: pipelineColumns,
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
    renderBodyContent,
    renderRow,
    renderCell,

    onRow: onPipelineRow,
  } = pipeline.use({
    dataSource: rawData,
    rowKey: rawRowKey,
    columns: rawColumns,
    estimatedRowHeight,
    headerWrapperRef,
    bodyWrapperRef,
    bodyRootRef: bodyRoot,
    bodyRef,
    rootRef: rootNode,
    getOffsetTop,
    getScroller,
    instance,
  })

  const [columnWidths, setColumnWidths] = useState(() => new Map<Key, number>())
  const columnWidthsRef = useRef(columnWidths)
  const updateColumnWidths = useCallback((value: Map<Key, number>) => {
    const result = new Map(columnWidthsRef.current)
    value.forEach((width, key) => {
      result.set(key, width)
    })
    columnWidthsRef.current = result
    setColumnWidths(result)
  }, [])

  const tableColumnsContext = useMemo<TableColumnsContextType>(() => {
    return {
      widthList: columnWidths,
      setWidthList: updateColumnWidths,
    }
  }, [columnWidths, updateColumnWidths])

  const { columns } = useColumnVirtualize<T>({
    estimateSize: estimatedColumnWidth ?? defaultColumnWidth,
    defaultColumnWidth,
    overscan: overscanColumns,
    columns: pipelineColumns,
    bodyWrapper: bodyWrapperRef,
    columnWidths,
    disabled: estimatedColumnWidth == null,
  })

  const onRowClassName = useCallback((record: T, index: number) => {
    return clsx(rawRowClassName?.(record, index), rowClassName?.(record, index))
  }, [rawRowClassName, rowClassName])

  const onRowProps: OnRowType<T> = useCallback((record, index) => {
    return { ...onRow?.(record, index), ...onPipelineRow?.(record, index) }
  }, [onPipelineRow, onRow])

  const hasFixedLeftColumn = pipelineColumns.some((x) => isValidFixedLeft(x.fixed))
  const hasFixedRightColumn = pipelineColumns.some((x) => isValidFixedRight(x.fixed))

  const fullHeaderColumns = useMemo(() => {
    return {
      columns: pipelineColumns,
      descriptor: pipelineColumns.map((column): ColumnDescriptor => {
        const key = getKey(column)
        return {
          key,
          type: 'normal',
          column,
        }
      }),
    }
  }, [pipelineColumns])

  const headerColumns = useMemo(() => {
    if (virtualHeader) {
      return columns
    }
    return fullHeaderColumns
  }, [virtualHeader, fullHeaderColumns, columns])

  const internalHook = (instance as InternalInstance).getInternalHooks()
  internalHook.implGetCurrentProps(() => props)
  internalHook.implGetDOM(() => {
    return {
      root: rootNode.current,
      headerWrapper: headerWrapperRef.current,
      bodyWrapper: bodyWrapperRef.current,
      bodyRoot: bodyRoot.current,
      body: bodyRef.current,
    }
  })
  internalHook.implScrollTo((options) => {
    const { left, top } = options
    if (left != null) {
      if (__DEV__) {
        if (bodyWrapperRef.current == null) {
          console.error('The bodyWrapper DOM is not obtained, and scrolling is not possible.')
        }
      }
      bodyWrapperRef.current?.scrollTo(options)
    }
    if (top != null) {
      const scroller = getScroller()
      if (scroller == null) {
        console.error('The scroller DOM is not obtained, and scrolling is not possible.')
        return
      }
      scroller.scrollTo(options)
    }
  })
  internalHook.implScrollValueByColumnKey((key) => {
    let scrollLeft = 0
    let leftFixedWidth = 0
    // pipelineColumns 是一个经过中间件处理的 columns
    // 因为中间件可能会处理 columns，比如：添加、删除、排序 columns
    for (const element of pipelineColumns) {
      const columnKey = getKey(element)
      const width = columnWidths.get(columnKey) ?? 0
      if (isValidFixedLeft(element.fixed)) {
        leftFixedWidth += width
      }
      if (columnKey === key) {
        break
      }
      scrollLeft += width
    }
    return scrollLeft - leftFixedWidth
  })
  internalHook.implScrollToColumn((key) => {
    instance.scrollTo({ left: instance.getScrollValueByColumnKey(key) })
  })

  const contentNode = pipelineRender(
    <>
      <TableHeader
        wrapperRef={headerWrapperRef}
        columns={headerColumns}
        stickyHeader={stickyHeader}
        renderHeaderWrapper={renderHeaderWrapper}
        renderHeaderRoot={renderHeaderRoot}
        renderHeader={renderHeader}
        renderHeaderRow={renderHeaderRow}
        renderHeaderCell={renderHeaderCell}
      />
      <TableBody
        instance={instance}
        bodyWrapperRef={bodyWrapperRef}
        bodyRootRef={mergedBodyRootRef}
        bodyRef={bodyRef}
        className={tableBodyClassName}
        style={tableBodyStyle}
        columns={columns}
        rowKey={rowKey}
        dataSource={dataSource}
        overscan={overscanRows}
        estimateSize={estimatedRowHeight}
        getScroller={getScroller}
        getOffsetTop={getOffsetTop}
        rowClassName={onRowClassName}
        onRow={onRowProps}
        renderBodyWrapper={renderBodyWrapper}
        renderBodyRoot={renderBodyRoot}
        renderBody={renderBody}
        renderBodyContent={renderBodyContent}
        renderRow={renderRow}
        renderCell={renderCell}
      />
    </>,
    renderContent,
    { columns: columns.columns, columnDescriptor: columns.descriptor },
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
      bodyScrollContainer={bodyWrapperRef}
    >
      {contentNode}
    </TableRoot>,
    render,
    { columns: columns.columns, columnDescriptor: columns.descriptor },
  )

  return (
    <ColumnSizes.Provider value={tableColumnsContext}>
      <StickyContext columns={pipelineColumns}>
        <ContainerSizeContext getScroller={getScroller} root={rootNode}>
          <HorizontalScrollContext>{table}</HorizontalScrollContext>
        </ContainerSizeContext>
      </StickyContext>
    </ColumnSizes.Provider>
  )
}

if (__DEV__) {
  VirtualTableCore.displayName = 'VirtualTable.Core'
}

export default memo(forwardRef(VirtualTableCore)) as <T>(
  props: VirtualTableCoreProps<T> & RefAttributes<HTMLDivElement>,
) => ReactElement
