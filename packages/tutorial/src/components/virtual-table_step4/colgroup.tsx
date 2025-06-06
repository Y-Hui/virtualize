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
        // 所有 col 渲染结束后，父元素 colgroup 渲染，执行父元素 ref 回调
        // 在这里所有的 col 都已经渲染了，宽度也有了，使用 onColumnSizesMeasure 把宽度传出去
        onColumnSizesMeasure(columnSizes.current)
      }}
    >
      {columns.map((column) => {
        const key = getKey(column)
        return (
          <col
            key={key}
            ref={(node) => {
              if (node == null || !enableMeasure) return
              // 计算列宽
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
