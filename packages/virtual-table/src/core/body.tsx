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
    Pick<RowProps<T>, 'onRow' | 'rowRender' | 'cellRender'> {
  className?: string
  style?: CSSProperties
  startIndex: number
  wrapperRef?: Ref<HTMLDivElement>
  tableRef?: Ref<HTMLTableElement>
  rowClassName?: (record: T, index: number) => string
  tableRender?: PipelineRender
  bodyRender?: PipelineRender
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
    tableRender,
    bodyRender,
    rowRender,
    cellRender,
  } = props

  const body = pipelineRender(
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
            rowRender={rowRender}
            cellRender={cellRender}
          />
        )
      })}
    </tbody>,
    bodyRender,
    { columns },
  )

  const { addShouldSyncElement } = useHorizontalScrollContext()

  return (
    <div
      ref={composeRef(wrapperRef, (node) => {
        if (node == null) return
        addShouldSyncElement('virtual-table-body', node)
      })}
      className="virtual-table-body-wrapper"
    >
      {pipelineRender(
        <table
          className={clsx(className, 'virtual-table-body')}
          style={style}
          ref={tableRef}
        >
          <Colgroup columns={columns} />
          {body}
        </table>,
        tableRender,
        { columns },
      )}
    </div>
  )
}

export default TableBody
