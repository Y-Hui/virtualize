import clsx from 'classnames'

import { type AnyObject } from '../types'
import { type NecessaryProps } from './internal'
import Row, { type RowProps } from './row'
import { type PipelineRender } from './types'
import { pipelineRender } from './utils/render-pipeline'

export interface TableBodyProps<T>
  extends NecessaryProps<T>,
    Pick<RowProps<T>, 'onRow' | 'rowPipelineRender' | 'cellPipelineRender'> {
  startIndex: number
  rowClassName?: (record: T, index: number) => string
  bodyRender?: PipelineRender
}

function TableBody<T>(props: TableBodyProps<T>) {
  const {
    dataSource,
    columns,
    rowKey,
    startIndex,
    rowClassName,
    onRow,
    bodyRender,
    rowPipelineRender,
    cellPipelineRender,
  } = props

  return pipelineRender(
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
            rowPipelineRender={rowPipelineRender}
            cellPipelineRender={cellPipelineRender}
          />
        )
      })}
    </tbody>,
    bodyRender,
    { columns },
  )
}

export default TableBody
