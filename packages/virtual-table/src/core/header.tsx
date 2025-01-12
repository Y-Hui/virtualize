import clsx from 'clsx'
import {
  createElement,
  type CSSProperties,
  type FC,
  Fragment,
  type Key,
  type RefObject,
  useLayoutEffect,
  useRef,
} from 'react'

import { findLastIndex } from '../utils/find-last-index'
import { composeRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { useTableSticky } from './context/sticky'
import { useTableColumns } from './context/table-columns'
import { pipelineRender } from './pipeline/render-pipeline'
import { type ColumnType, type PipelineRender } from './types'
import { isValidFixed, isValidFixedLeft, isValidFixedRight } from './utils/verification'

export interface TableHeaderProps {
  className?: string
  style?: CSSProperties

  wrapperRef?: RefObject<HTMLDivElement>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnType<any>[]

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  renderHeaderWrapper?: PipelineRender
  renderHeaderRoot?: PipelineRender
  renderHeader?: PipelineRender
  renderHeaderRow?: PipelineRender
  renderHeaderCell?: PipelineRender
}

const TableHeader: FC<TableHeaderProps> = (props) => {
  const {
    className,
    style,
    wrapperRef,
    columns,
    stickyHeader,
    renderHeaderWrapper,
    renderHeaderRoot,
    renderHeader,
    renderHeaderRow,
    renderHeaderCell,
  } = props

  const { widthList, setWidthList } = useTableColumns()
  const { size: stickySizes } = useTableSticky()
  const columnsWidthRef = useRef<number[]>([])
  useLayoutEffect(() => {
    setWidthList(columnsWidthRef.current)
  })

  const lastFixedLeftColumnIndex = findLastIndex(columns, (x) => isValidFixedLeft(x.fixed))
  const firstFixedRightColumnIndex = columns.findIndex((x) => isValidFixedRight(x.fixed))

  const { addShouldSyncElement } = useHorizontalScrollContext()

  const row = pipelineRender(
    <tr>
      {columns.map((column, index) => {
        if (column.colSpan === 0) {
          return null
        }

        const key = 'key' in column ? (column.key as Key) : column.dataIndex

        const {
          className: thClassName,
          style: thStyle,
          ...rest
        } = column.onHeaderCell?.(column, index) ?? {}

        return (
          <Fragment key={typeof key === 'symbol' ? index : key}>
            {pipelineRender(
              createElement(
                'th',
                {
                  scope: 'col',
                  ...rest,
                  colSpan: column.colSpan,
                  className: clsx(
                    'virtual-table-header-cell',
                    column.align != null && `virtual-table-align-${column.align}`,
                    isValidFixed(column.fixed) && 'virtual-table-sticky-cell',
                    lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
                    firstFixedRightColumnIndex === index && 'virtual-table-cell-fix-right-first',
                    column.className,
                    thClassName,
                  ),
                  style: {
                    ...thStyle,
                    left: isValidFixedLeft(column.fixed) ? stickySizes[index] : undefined,
                    right: isValidFixedRight(column.fixed)
                      ? stickySizes[index]
                      : undefined,
                  },
                },
                column.title,
              ),
              renderHeaderCell,
              { column, columns, columnIndex: index, columnWidthList: widthList },
            )}
          </Fragment>
        )
      })}
    </tr>,
    renderHeaderRow,
    { columns },
  )

  const theadNode = pipelineRender(
    <thead className="virtual-table-thead">{row}</thead>,
    renderHeader,
    { columns },
  )

  const tableNode = pipelineRender(
    <table
      style={{
        ...style,
        top: Number.isFinite(stickyHeader) ? (stickyHeader as number) : undefined,
      }}
    >
      <Colgroup
        columns={columns}
        colRef={(node, index) => {
          if (node == null) return
          columnsWidthRef.current[index] = node.offsetWidth
        }}
      />
      {theadNode}
    </table>,
    renderHeaderRoot,
    { columns },
  )

  return pipelineRender(
    <div
      ref={composeRef(wrapperRef, (node) => {
        if (node == null) {
          return
        }
        addShouldSyncElement('virtual-table-header', node)
      })}
      className={clsx('virtual-table-header', className, {
        'virtual-table-header-sticky': stickyHeader,
      })}
    >
      {tableNode}
    </div>,
    renderHeaderWrapper,
    { columns },
  )
}

export default TableHeader
