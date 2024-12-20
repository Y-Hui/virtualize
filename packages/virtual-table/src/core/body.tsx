import clsx from 'classnames'
import { type CSSProperties, type Ref } from 'react'

import { type AnyObject } from '../types'
import { composeRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { type NecessaryProps } from './internal'
import Row, { type RowProps } from './row'
import { type PipelineRender } from './types'
import { pipelineRender } from './utils/render-pipeline'

export interface TableBodyProps<T>
  extends NecessaryProps<T>,
    Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  className?: string
  style?: CSSProperties
  startIndex: number
  wrapperRef?: Ref<HTMLDivElement>
  tableRef?: Ref<HTMLTableElement>
  rowClassName?: (record: T, index: number) => string
  renderBodyWrapper?: PipelineRender
  renderBodyRoot?: PipelineRender
  renderBody?: PipelineRender
}

function TableBody<T>(props: TableBodyProps<T>) {
  const {
    wrapperRef,
    tableRef,
    className,
    style,
    dataSource,
    columns,
    rowKey,
    startIndex,
    rowClassName,
    onRow,
    renderBodyWrapper,
    renderBodyRoot,
    renderBody,
    renderRow,
    renderCell,
  } = props

  const { addShouldSyncElement } = useHorizontalScrollContext()

  const bodyNode = pipelineRender(
    <tbody>
      {dataSource?.map((e, rowIndex) => {
        const _rowKey = (e as AnyObject)[rowKey as string]
        return (
          <Row
            key={_rowKey}
            className={clsx(rowClassName?.(e, rowIndex))}
            rowIndex={rowIndex + startIndex}
            rowData={e}
            columns={columns}
            onRow={onRow}
            renderRow={renderRow}
            renderCell={renderCell}
          />
        )
      })}
    </tbody>,
    renderBody,
    { columns },
  )

  const tableNode = pipelineRender(
    <table className={clsx(className, 'virtual-table-body')} style={style} ref={tableRef}>
      <Colgroup columns={columns} />
      {bodyNode}
    </table>,
    renderBodyRoot,
    { columns },
  )

  return pipelineRender(
    <div
      ref={composeRef(wrapperRef, (node) => {
        if (node == null) return
        addShouldSyncElement('virtual-table-body', node)
      })}
      className="virtual-table-body-wrapper"
    >
      {tableNode}
    </div>,
    renderBodyWrapper,
    { columns },
  )
}

export default TableBody
