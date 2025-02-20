import type { Key } from 'react'
import type { ColumnType } from './types'
import { useRef } from 'react'
import { getKey } from './utils/get-key'

export interface ColgroupProps<T> {
  columns: ColumnType<T>[]
  onColumnSizesMeasure?: (columnSizes: Map<Key, number>) => void
}

function Colgroup<T>(props: ColgroupProps<T>) {
  const { columns, onColumnSizesMeasure } = props

  const enableMeasure = onColumnSizesMeasure != null
  const columnSizes = useRef(new Map<Key, number>())

  return (
    <colgroup
      ref={() => {
        if (!enableMeasure) return
        onColumnSizesMeasure(columnSizes.current)
      }}
    >
      {columns.map((column, columnIndex) => {
        const key = getKey(column)
        return (
          <col
            key={typeof key === 'symbol' ? columnIndex : key}
            ref={(node) => {
              if (node == null || !enableMeasure) return
              columnSizes.current.set(key, node.offsetWidth)
            }}
            style={{ width: column.width, minWidth: column.minWidth }}
          />
        )
      })}
    </colgroup>
  )
}

export default Colgroup
