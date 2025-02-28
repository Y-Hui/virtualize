import type { FC, Key } from 'react'
import type { ColumnDescriptor } from './types'
import { memo, useRef } from 'react'
import { isShallowEqual } from '../utils/equal'

export interface ColgroupProps {
  columns: ColumnDescriptor[]
  onColumnSizesMeasure?: (columnSizes: Map<Key, number>) => void
}

const Colgroup: FC<ColgroupProps> = (props) => {
  const { columns, onColumnSizesMeasure } = props

  const enableMeasure = onColumnSizesMeasure != null
  const columnSizes = new Map<Key, number>()
  const prevColumnSizes = useRef(new Map<Key, number>())

  return (
    <colgroup
      ref={() => {
        if (!enableMeasure) return
        if (!isShallowEqual(columnSizes, prevColumnSizes.current)) {
          onColumnSizesMeasure(columnSizes)
          prevColumnSizes.current = columnSizes
        }
      }}
    >
      {columns.map((item) => {
        const { key } = item
        if (item.type === 'blank') {
          return <col key={key} className="blank" style={{ width: item.width }} />
        }

        const { column } = item

        return (
          <col
            key={key}
            ref={(node) => {
              if (node == null || !enableMeasure) return
              columnSizes.set(key, node.offsetWidth)
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

export default memo(Colgroup)
