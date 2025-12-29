import type { ColumnDescriptor } from '@are-visual/virtual-table'
import type { CSSProperties, Key, ReactElement } from 'react'
import { findLastIndex, isValidFixedLeft, isValidFixedRight } from '@are-visual/virtual-table'
import clsx from 'clsx'
import { memo } from 'react'
import LoadingCell from './cell'

export interface RowProps<T> {
  style?: CSSProperties
  descriptor: ColumnDescriptor<T>[]
  rowKey: Key
}

function LoadingRow<T>(props: RowProps<T>) {
  const { descriptor, style } = props

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

  return (
    <tr
      className="virtual-table-row virtual-table-loading-cell"
      style={style}
    >
      {descriptor.map((item, index) => {
        const { key } = item
        if (item.type === 'blank') {
          return <td key={key} />
        }
        const { column } = item
        return (
          <LoadingCell
            key={key}
            className={clsx(
              lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
              firstFixedRightColumnIndex === index
              && 'virtual-table-cell-fix-right-first',
            )}
            column={column}
          />
        )
      })}
    </tr>
  )
}

export default memo(LoadingRow) as <T>(props: RowProps<T>) => ReactElement
