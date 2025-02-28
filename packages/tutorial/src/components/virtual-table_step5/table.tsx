import './style.scss'

import type { Key } from 'react'
import type { AnyObject, ColumnType } from './types'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import Colgroup from './colgroup'
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
  const { rowKey, dataSource: originalDataSource, columns: originalColumns, estimatedRowHeight = 40, estimatedColumnWidth } = props

  const rootNode = useRef<HTMLDivElement>(null)
  const getScrollContainer = useCallback(() => {
    const root = rootNode.current
    if (root == null) return
    return getScrollParent(root)
  }, [])

  const { dataSource, topBlank, bottomBlank, startIndex, updateRowHeight } = useRowVirtualize({
    dataSource: originalDataSource,
    estimateSize: estimatedRowHeight,
    overscan: 5,
    getScrollContainer,
  })

  const headWrapper = useRef<HTMLDivElement>(null)
  const bodyWrapper = useRef<HTMLDivElement>(null)

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
    columns: originalColumns,
    bodyWrapper,
    columnWidths: columnSizes,
    disabled: estimatedColumnWidth == null,
  })

  const { hasFixedLeft, hasFixedRight } = useCheckFixed({ bodyScrollContainer: bodyWrapper, columns })
  const calcFixedStyle = useColumnSticky({ columns, columnSizes })

  return (
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
      <div ref={headWrapper} className="virtual-table-header-wrapper">
        <table className="virtual-table-header-root">
          <Colgroup columns={descriptor} />
          <thead className="virtual-table-header">
            <tr>
              {descriptor.map((item) => {
                const { key } = item
                if (item.type === 'blank') {
                  return <th key={key} />
                }
                const { column } = item
                // 固定列样式
                const { className, style } = calcFixedStyle(column)
                return (
                  <th
                    className={clsx('virtual-table-header-cell', className)}
                    key={key}
                    style={style}
                  >
                    {column.title}
                  </th>
                )
              })}
            </tr>
          </thead>
        </table>
      </div>

      <div ref={bodyWrapper} className="virtual-table-body-wrapper">
        <table
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
          <tbody className="virtual-table-body">
            {dataSource?.map((e, index) => {
              const rowIndex = startIndex + index
              const rowData = e as AnyObject
              const key = rowData[rowKey as string]
              return (
                <tr
                  key={key}
                  ref={(node) => {
                    if (node == null) return
                    updateRowHeight(rowIndex, node.offsetHeight)
                  }}
                >
                  {descriptor.map((item) => {
                    const { key: columnKey } = item
                    if (item.type === 'blank') {
                      return <td key={columnKey} />
                    }

                    const { column } = item
                    // 固定列样式
                    const { className, style } = calcFixedStyle(column)
                    return (
                      <td
                        key={columnKey}
                        className={clsx('virtual-table-cell', className)}
                        style={style}
                      >
                        {getTableCellContent(rowIndex, rowData, column)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VirtualTable
