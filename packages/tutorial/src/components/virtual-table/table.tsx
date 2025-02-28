import './style.scss'

import type { Key } from 'react'
import type { AnyObject, ColumnType } from './types'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import Colgroup from './colgroup'
import { pipelineRender } from './pipeline/render-pipeline'
import { TablePipeline } from './pipeline/useTablePipeline'
import { useCheckFixed } from './useCheckFixed'
import { useColumnSticky } from './useColumnSticky'
import { useColumnVirtualize } from './useColumnVirtualize'
import { useRowVirtualize } from './useRowVirtualize'
import { getScrollParent } from './utils/dom'

export interface VirtualTableProps<T> {
  rowKey: keyof T | (string & {})
  columns: ColumnType<T>[]
  dataSource?: T[]
  estimatedRowHeight?: number
  estimatedColumnWidth?: number
  pipeline?: TablePipeline<T>
}

function getTableCellContent<T extends AnyObject>(
  index: number,
  data: T,
  column: ColumnType<any>,
) {
  const { render } = column
  const rowData = data as AnyObject
  if ('dataIndex' in column) {
    const dataIndex = column.dataIndex as string
    if (typeof render !== 'function') {
      return String(rowData[dataIndex])
    }
    return render(rowData[dataIndex], data, index)
  }
  return render?.(data, data, index) ?? null
}

function VirtualTable<T>(props: VirtualTableProps<T>) {
  const {
    rowKey: originalRowKey,
    dataSource: originalDataSource,
    columns: originalColumns,
    estimatedRowHeight = 40,
    estimatedColumnWidth,
    pipeline = TablePipeline.defaultInstance as TablePipeline<T>,
  } = props

  const rootNode = useRef<HTMLDivElement>(null)
  const getScrollContainer = useCallback(() => {
    const root = rootNode.current
    if (root == null) return
    return getScrollParent(root)
  }, [])

  const headWrapper = useRef<HTMLDivElement>(null)
  const bodyWrapper = useRef<HTMLDivElement>(null)
  const bodyRootRef = useRef<HTMLTableElement>(null)
  const bodyRef = useRef<HTMLTableSectionElement>(null)

  const {
    dataSource: pipelineDataSource,
    columns: pipelineColumns,
    rowKey,
    rowClassName,

    render,
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
    dataSource: originalDataSource ?? [],
    columns: originalColumns,
    rowKey: originalRowKey,
    estimatedRowHeight,
    rootRef: rootNode,
    headerWrapperRef: headWrapper,
    bodyWrapperRef: bodyWrapper,
    bodyRootRef,
    bodyRef,
    getScroller: getScrollContainer,
  })

  const { dataSource, topBlank, bottomBlank, startIndex, updateRowHeight } = useRowVirtualize({
    dataSource: pipelineDataSource,
    estimateSize: estimatedRowHeight,
    overscan: 5,
    getScrollContainer,
  })

  // 横向滚动同步
  useEffect(() => {
    const head = headWrapper.current
    const body = bodyWrapper.current
    if (head == null || body == null) return
    const nodes = [head, body]

    const rAF = (fn: () => void) => {
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
          fn()
        })
      } else {
        fn()
      }
    }

    const skipEventNodes = new Set<HTMLElement>()
    const onScroll = (e: Event) => {
      const element = e.target as HTMLElement
      if (skipEventNodes.has(element)) {
        skipEventNodes.delete(element)
        return
      }
      nodes.forEach((node) => {
        if (node === element) return
        skipEventNodes.add(node)
        rAF(() => {
          // 设置 scrollLeft 后会触发 scroll 事件
          // 但是此处正在进行滚动同步，所以要忽略 node 所触发的 scroll 事件
          // 使用 skipEventNodes 来记录 node 并跳过
          node.scrollLeft = element.scrollLeft
        })
      })
    }

    nodes.forEach((node) => {
      node.addEventListener('scroll', onScroll)
    })

    return () => {
      nodes.forEach((node) => {
        node.removeEventListener('scroll', onScroll)
      })
    }
  }, [])

  const [columnSizes, setColumnSizes] = useState(() => new Map<Key, number>())

  const { columns, descriptor } = useColumnVirtualize<T>({
    estimateSize: estimatedColumnWidth ?? 100,
    overscan: 3,
    columns: pipelineColumns,
    bodyWrapper,
    columnWidths: columnSizes,
    disabled: estimatedColumnWidth == null,
  })

  const { hasFixedLeft, hasFixedRight } = useCheckFixed({ bodyScrollContainer: bodyWrapper, columns })
  const calcFixedStyle = useColumnSticky({ columns, columnSizes })

  const headerRow = pipelineRender(
    <tr>
      {descriptor.map((item) => {
        const { key } = item
        if (item.type === 'blank') {
          return <th key={key} />
        }
        const { column } = item
        const { className, style } = calcFixedStyle(column)
        const cellNode = (
          <th
            className={clsx('virtual-table-header-cell', className)}
            key={key}
            style={style}
          >
            {column.title}
          </th>
        )
        return pipelineRender(cellNode, renderHeaderCell, {
          columns,
          columnDescriptor: descriptor,
          column,
          columnWidths: columnSizes,
        })
      })}
    </tr>,
    renderHeaderRow,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )
  const header = pipelineRender(
    <thead className="virtual-table-header">
      {headerRow}
    </thead>,
    renderHeader,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )
  const headerRoot = pipelineRender(
    <table className="virtual-table-header-root">
      <Colgroup columns={descriptor} />
      {header}
    </table>,
    renderHeaderRoot,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )
  const tableHeaderWrapper = pipelineRender(
    <div ref={headWrapper} className="virtual-table-header-wrapper">
      {headerRoot}
    </div>,
    renderHeaderWrapper,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )

  const body = pipelineRender(
    <tbody ref={bodyRef} className="virtual-table-body">
      {dataSource?.map((e, index) => {
        const rowIndex = startIndex + index
        const rowData = e as AnyObject
        const key = rowData[rowKey as string]
        const { className: extraClassName, ...extraProps } = onPipelineRow?.(e, rowIndex) ?? {}
        const rowNode = (
          <tr
            {...extraProps}
            key={key}
            ref={(node) => {
              if (node == null) return
              updateRowHeight(rowIndex, node.offsetHeight)
            }}
            className={clsx(extraClassName, rowClassName?.(e, rowIndex))}
          >
            {descriptor.map((item) => {
              const { key: columnKey } = item
              if (item.type === 'blank') {
                return <td key={columnKey} />
              }

              const { column } = item
              const { className, style } = calcFixedStyle(column)
              const cellNode = (
                <td
                  key={columnKey}
                  className={clsx('virtual-table-cell', className)}
                  style={style}
                >
                  {getTableCellContent(rowIndex, rowData, column)}
                </td>
              )
              return pipelineRender(cellNode, renderCell, {
                column,
              })
            })}
          </tr>
        )
        return pipelineRender(rowNode, renderRow, {
          columns,
          columnDescriptor: descriptor,
          rowIndex,
          rowData: e,
        })
      })}
    </tbody>,
    renderBody,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )
  const bodyRoot = pipelineRender(
    <table
      ref={bodyRootRef}
      className="virtual-table-body-root"
      style={{
        paddingBottom: bottomBlank,
        paddingTop: topBlank,
      }}
    >
      <Colgroup
        columns={descriptor}
        onColumnSizesMeasure={(e) => {
          // TODO: 对比数据是否变化再更新
          setColumnSizes(e)
        }}
      />
      {body}
    </table>,
    renderBodyRoot,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )
  const tableBodyWrapper = pipelineRender(
    <div ref={bodyWrapper} className="virtual-table-body-wrapper">
      {bodyRoot}
    </div>,
    renderBodyWrapper,
    {
      columns,
      columnDescriptor: descriptor,
    },
  )

  const content = pipelineRender(
    <>
      {tableHeaderWrapper}
      {tableBodyWrapper}
    </>,
    renderContent,
    { columns, columnDescriptor: descriptor },
  )

  return pipelineRender(
    <div
      ref={rootNode}
      className={clsx(
        'virtual-table',
        // 需要显示左侧阴影
        hasFixedLeft && 'virtual-table-has-fix-left',

        // 需要显示右侧阴影
        hasFixedRight && 'virtual-table-has-fix-right',
      )}
    >
      {content}
    </div>,
    render,
    { columns, columnDescriptor: descriptor },
  )
}

export default VirtualTable
