import type { Key } from 'react'
import type { ColumnDescriptor } from './types'
import { useRef } from 'react'

export interface ColgroupProps<T> {
  columns: ColumnDescriptor<T>[]
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
      {columns.map((item) => {
        const { key } = item
        if (item.type === 'blank') {
          return <col key={key} style={{ width: item.width }} />
        }

        const { column } = item

        return (
          <col
            key={key}
            ref={(node) => {
              if (node == null || !enableMeasure) return
              columnSizes.current.set(key, node.offsetWidth)
            }}
            style={{
              width: column.width,
              minWidth: column.minWidth,
            }}
          />
        )
      })}
    </colgroup>
  )
}

export default Colgroup
