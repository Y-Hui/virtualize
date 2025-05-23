import type { CSSProperties, FC, RefObject } from 'react'
import type {
  MiddlewareRenderHeader,
  MiddlewareRenderHeaderCell,
  MiddlewareRenderHeaderRoot,
  MiddlewareRenderHeaderRow,
  MiddlewareRenderHeaderWrapper,
} from './pipeline/types'
import type { InnerColumnDescriptor } from './types'
import clsx from 'clsx'
import { createElement, Fragment, memo } from 'react'
import { findLastIndex } from '../utils/find-last-index'
import { useMergedRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useColumnSizes } from './context/column-sizes'
import { useScrollSynchronize } from './context/horizontal-scroll'
import { useTableSticky } from './context/sticky'
import { pipelineRender } from './pipeline/render-pipeline'
import { getKey } from './utils/get-key'
import { isValidFixed, isValidFixedLeft, isValidFixedRight } from './utils/verification'

export interface TableHeaderProps {
  className?: string
  style?: CSSProperties

  defaultColumnWidth: number

  wrapperRef?: RefObject<HTMLDivElement>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: InnerColumnDescriptor<any>

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  renderHeaderWrapper?: MiddlewareRenderHeaderWrapper
  renderHeaderRoot?: MiddlewareRenderHeaderRoot
  renderHeader?: MiddlewareRenderHeader
  renderHeaderRow?: MiddlewareRenderHeaderRow
  renderHeaderCell?: MiddlewareRenderHeaderCell
}

const TableHeader: FC<TableHeaderProps> = (props) => {
  const {
    className,
    style,
    defaultColumnWidth,
    wrapperRef,
    columns: columnDescriptor,
    stickyHeader,
    renderHeaderWrapper,
    renderHeaderRoot,
    renderHeader,
    renderHeaderRow,
    renderHeaderCell,
  } = props

  const { columns, descriptor } = columnDescriptor
  const lastColumn = columns[columns.length - 1]

  const { widthList } = useColumnSizes()
  const { size: stickySizes } = useTableSticky()

  const lastFixedLeftColumnIndex = findLastIndex(descriptor, (x) => {
    if (x.type === 'blank') {
      return false
    }
    return isValidFixedLeft(x.column.fixed)
  })
  const firstFixedRightColumnIndex = descriptor.findIndex((x) => {
    if (x.type === 'blank') {
      return false
    }
    return isValidFixedRight(x.column.fixed)
  })

  const headerWrapperRef = useScrollSynchronize('virtual-table-header')

  const row = pipelineRender(
    <tr>
      {descriptor.map((item, index) => {
        const { key } = item
        if (item.type === 'blank') {
          return <th key={key} data-blank />
        }

        const { column } = item

        if (column.colSpan === 0) {
          return null
        }

        const isLast = getKey(lastColumn) === key
        const {
          className: thClassName,
          style: thStyle,
          ...rest
        } = column.onHeaderCell?.(column, index) ?? {}

        return (
          <Fragment key={key}>
            {pipelineRender(
              createElement(
                'th',
                {
                  scope: 'col',
                  ...rest,
                  colSpan: column.colSpan,
                  className: clsx(
                    'virtual-table-header-cell',
                    isLast && 'no-split',
                    column.align != null && `virtual-table-align-${column.align}`,
                    isValidFixed(column.fixed) && 'virtual-table-sticky-cell',
                    lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
                    firstFixedRightColumnIndex === index && 'virtual-table-cell-fix-right-first',
                    column.className,
                    thClassName,
                  ),
                  style: {
                    ...thStyle,
                    left: isValidFixedLeft(column.fixed) ? stickySizes.get(key) : undefined,
                    right: isValidFixedRight(column.fixed)
                      ? stickySizes.get(key)
                      : undefined,
                  },
                },
                column.title,
              ),
              renderHeaderCell,
              { column, columns, columnWidths: widthList, columnDescriptor: descriptor },
            )}
          </Fragment>
        )
      })}
    </tr>,
    renderHeaderRow,
    { columns, columnDescriptor: descriptor },
  )

  const theadNode = pipelineRender(
    <thead className="virtual-table-thead">{row}</thead>,
    renderHeader,
    { columns, columnDescriptor: descriptor },
  )

  const tableNode = pipelineRender(
    <table
      style={style}
    >
      <Colgroup columns={descriptor} defaultColumnWidth={defaultColumnWidth} />
      {theadNode}
    </table>,
    renderHeaderRoot,
    { columns, columnDescriptor: descriptor },
  )

  const mergedRef = useMergedRef(wrapperRef, headerWrapperRef)

  return pipelineRender(
    <div
      ref={mergedRef}
      className={clsx('virtual-table-header', className, {
        'virtual-table-header-sticky': stickyHeader,
      })}
      style={{
        top: Number.isFinite(stickyHeader) ? (stickyHeader as number) : undefined,
      }}
    >
      {tableNode}
    </div>,
    renderHeaderWrapper,
    { columns, columnDescriptor: descriptor },
  )
}

export default memo(TableHeader)
