import './style.scss'

import type { Key } from 'react'
import type { AnyObject, ColumnType } from './types'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import Colgroup from './colgroup'
import { useCheckFixed } from './useCheckFixed'
import { useColumnSticky } from './useColumnSticky'
import { getKey } from './utils/get-key'

export interface VirtualTableProps<T> {
  rowKey: keyof T | (string & {})
  columns: ColumnType<T>[]
  dataSource?: T[]
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
  const { rowKey, dataSource, columns } = props

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
  const { hasFixedLeft, hasFixedRight } = useCheckFixed({ bodyScrollContainer: bodyWrapper, columns })
  const calcFixedStyle = useColumnSticky({ columns, columnSizes })

  return (
    <div
      className={clsx(
        'virtual-table',
        hasFixedLeft && 'virtual-table-has-fix-left',
        hasFixedRight && 'virtual-table-has-fix-right',
      )}
    >
      <div ref={headWrapper} className="virtual-table-header-wrapper">
        <table className="virtual-table-header-root">
          <Colgroup columns={columns} />
          <thead className="virtual-table-header">
            <tr>
              {columns.map((column, columnIndex) => {
                const key = getKey(column)
                const { className, style } = calcFixedStyle(column)
                return (
                  <th
                    className={clsx('virtual-table-header-cell', className)}
                    key={typeof key === 'symbol' ? columnIndex : key}
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
        <table className="virtual-table-body-root">
          <Colgroup
            columns={columns}
            onColumnSizesMeasure={(e) => {
              // TODO: 对比数据是否变化再更新
              setColumnSizes(e)
            }}
          />
          <tbody className="virtual-table-body">
            {dataSource?.map((e, rowIndex) => {
              const rowData = e as AnyObject
              const key = rowData[rowKey as string]
              return (
                <tr key={key}>
                  {columns.map((column, columnIndex) => {
                    const columnKey = getKey(column)
                    const { className, style } = calcFixedStyle(column)
                    return (
                      <td
                        key={typeof columnKey === 'symbol' ? columnIndex : columnKey}
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
