import type { FC, Key } from 'react'
import type { ColumnDescriptor } from './types'
import { memo, useLayoutEffect, useRef } from 'react'
import { isShallowEqual } from '../utils/equal'
import { onResize } from './utils/on-resize'

export interface ColgroupProps {
  columns: ColumnDescriptor[]
  onColumnSizesMeasure?: (columnSizes: Map<Key, number>) => void
}

const Colgroup: FC<ColgroupProps> = (props) => {
  const { columns, onColumnSizesMeasure } = props

  const enableMeasure = onColumnSizesMeasure != null
  const columnSizes = new Map<Key, () => number>()
  const prevColumnSizes = useRef(new Map<Key, number>())

  const node = useRef<HTMLTableColElement>(null)
  useLayoutEffect(() => {
    if (!enableMeasure) return
    const colgroupNode = node.current
    if (colgroupNode == null) return
    return onResize(colgroupNode, ({ width }) => {
      if (width === 0) return
      const sizes = new Map<Key, number>()
      columnSizes.forEach((item, key) => {
        sizes.set(key, item())
      })
      if (!isShallowEqual(sizes, prevColumnSizes.current)) {
        onColumnSizesMeasure(sizes)
        prevColumnSizes.current = sizes
      }
    })
  })

  return (
    <colgroup ref={node}>
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
              // eslint-disable-next-line react-compiler/react-compiler
              columnSizes.set(key, () => node.offsetWidth)
            }}
            data-col-key={key}
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
