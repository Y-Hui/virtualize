import clsx from 'classnames'
import {
  createElement,
  type CSSProperties,
  type FC,
  useLayoutEffect,
  useRef,
} from 'react'

import { findLastIndex } from '../utils/find-last-index'
import { useTableColumns } from './context/table-columns'
import { type ColumnType, type PipelineRender } from './types'
import { pipelineRender } from './utils/render-pipeline'

export interface TableHeaderProps {
  className?: string
  style?: CSSProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnType<any>[]

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  headerRender?: PipelineRender
  cellRender?: PipelineRender
}

const TableHeader: FC<TableHeaderProps> = (props) => {
  const { className, style, columns, stickyHeader, headerRender, cellRender } = props

  const { setWidthList, stickySizes } = useTableColumns()
  const columnsWidthRef = useRef<number[]>([])
  useLayoutEffect(() => {
    setWidthList(columnsWidthRef.current)
  })

  const lastFixedLeftColumnIndex = findLastIndex(columns, (x) => x.fixed === 'left')
  const lastFixedRightColumnIndex = columns.findIndex((x) => x.fixed === 'right')

  return (
    <table
      className={clsx('virtual-table-header-wrapper', className, {
        'virtual-table-sticky-header': stickyHeader != null,
      })}
      style={{
        ...style,
        top: Number.isFinite(stickyHeader) ? (stickyHeader as number) : undefined,
      }}
    >
      <colgroup>
        {columns.map((column, index) => {
          const key = 'key' in column ? column.key : column.dataIndex
          return (
            <col
              key={typeof key === 'symbol' ? index : key}
              style={{
                width: column.width,
                minWidth: column.minWidth,
              }}
              ref={(node) => {
                if (node == null) return
                columnsWidthRef.current[index] = node.offsetWidth
              }}
            />
          )
        })}
      </colgroup>
      <thead className="virtual-table-header">
        {pipelineRender(
          <tr>
            {columns.map((column, index) => {
              if (column.colSpan === 0) {
                return null
              }

              const key = 'key' in column ? column.key : column.dataIndex
              const {
                className: thClassName,
                style: thStyle,
                ...rest
              } = column.onHeaderCell?.(column, index) || {}

              return pipelineRender(
                createElement(
                  'th',
                  {
                    key: typeof key === 'symbol' ? index : key,
                    scope: 'col',
                    ...rest,
                    colSpan: column.colSpan,
                    className: clsx(
                      'virtual-table-header-cell',
                      column.align != null && `virtual-table-align-${column.align}`,
                      typeof column.fixed === 'string' && 'virtual-table-sticky-cell',
                      lastFixedLeftColumnIndex === index &&
                        'virtual-table-cell-fix-left-last',
                      lastFixedRightColumnIndex === index &&
                        'virtual-table-cell-fix-right-last',
                      thClassName,
                    ),
                    style: {
                      ...thStyle,
                      left: column.fixed === 'left' ? stickySizes[index] : undefined,
                      right: column.fixed === 'right' ? stickySizes[index] : undefined,
                    },
                  },
                  column.title,
                ),
                cellRender,
              )
            })}
          </tr>,
          headerRender,
        )}
      </thead>
    </table>
  )
}

export default TableHeader
