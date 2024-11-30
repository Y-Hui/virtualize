import clsx from 'classnames'

import { type AnyObject, type NecessaryProps } from '../types'
import Row, { type RowProps } from './row'

export interface TableBodyProps<T> extends NecessaryProps<T>, Pick<RowProps<T>, 'onRow'> {
  startIndex: number
  rowClassName?: (record: T, index: number) => string
}

function TableBody<T>(props: TableBodyProps<T>) {
  const { dataSource, columns, rowKey, startIndex, rowClassName, onRow } = props

  return (
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
          />
        )
      })}
    </tbody>
  )
}

export default TableBody
