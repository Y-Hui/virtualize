import clsx from 'classnames'

import { type AnyObject, type NecessaryProps } from '../types'
import Row from './row'

export interface TableBodyProps<T> extends NecessaryProps<T> {
  startIndex: number
  rowClassName?: (record: T, index: number) => string
}

function TableBody<T>(props: TableBodyProps<T>) {
  const { dataSource, columns, rowKey, startIndex, rowClassName } = props

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
          />
        )
      })}
    </tbody>
  )
}

export default TableBody
