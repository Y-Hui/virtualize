/* eslint-disable react-compiler/react-compiler */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Key, MutableRefObject } from 'react'
import type { NecessaryProps } from '../internal'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { getRowKey } from '../utils/get-key'
import { useLazyRef } from './useLazyRef'

interface UseRowHeightOptions<T> {
  debugKey?: string
  estimateSize: number
  dataSource: T[]
  rowKey: NecessaryProps<T>['rowKey']
  nodeHeightValid: () => boolean
}

export interface RowRect {
  index: number
  height: number
  top: number
  bottom: number
}

export const NormalRowHeightKey = 'NormalRow'

/**
 * 记录的所有行高信息
 * 一个 Row 可能有多个行高。例如：默认情况下，只有一个行高，展开后，展开面板的高度也被认为是同一个 Row 的
 * 所以可展开时，行高有多个，所有行高之和，则为 Row 的高度
 * 行高之间使用唯一的 key 作为区分
 * Record<rowKey, Map<key, height>>
 */
function useRowHeightMap(initial: (val: Map<Key, Map<Key, number>>) => Map<Key, Map<Key, number>>) {
  const heightMap = useRef<Map<Key, Map<Key, number>> | null>(null)
  if (heightMap.current == null) {
    const result = new Map<Key, Map<Key, number>>()
    heightMap.current = initial(result)
  } else {
    heightMap.current = initial(heightMap.current)
  }
  return heightMap as MutableRefObject<Map<Key, Map<Key, number>>>
}

export function useRowHeight<T = any>(options: UseRowHeightOptions<T>) {
  const { debugKey, estimateSize, dataSource, rowKey, nodeHeightValid } = options

  const [rowHeightByRowKey, setRowHeightByRowKey] = useState(() => new Map<Key, Map<Key, number>>())
  const rowHeightByRowKeyRef = useRowHeightMap((state) => {
    // 行高信息（先填充预估高度，DOM渲染后再更新成实际高度）
    if (dataSource.length === 0) {
      state.clear()
      return state
    }
    dataSource.forEach((item) => {
      const key = getRowKey(item, rowKey)
      const row = state.get(key) ?? new Map<Key, number>()
      const target = row.get(NormalRowHeightKey)
      if (target == null) {
        row.set(NormalRowHeightKey, estimateSize)
      }
      state.set(key, row)
    })
    return state
  })

  const calcRowHeights = () => {
    const heights: number[] = []
    dataSource.forEach((item) => {
      const key = getRowKey(item, rowKey)
      const row = rowHeightByRowKeyRef.current.get(key)
      if (row == null) {
        heights.push(estimateSize)
      } else {
        let height = 0
        row.forEach((x) => height += x)
        heights.push(height)
      }
    })
    return heights
  }
  const [rowHeights, setRowHeights] = useState<number[]>(calcRowHeights)

  // 布局信息（也就是锚点元素需要的信息，top,bottom,height,index）
  const calcRowRects = () => {
    const { rects } = dataSource.reduce((result, rowData, index) => {
      const key = getRowKey(rowData, rowKey)
      let height = 0
      rowHeightByRowKeyRef.current.get(key)?.forEach((item) => {
        height += item
      })
      const nextTop = result.top + height
      result.rects.push({
        index,
        top: result.top,
        height,
        bottom: nextTop,
      })
      result.top = nextTop
      return result
    }, { top: 0, rects: [] as RowRect[] })
    return rects
  }
  const rowRectsRef = useLazyRef<RowRect[]>(calcRowRects)

  const measureTask = useRef(new Map<Key, Map<Key, () => number | undefined>>())
  const measureRowHeightByRowKey = useCallback((rowKey: Key, key: Key, height: () => number | undefined) => {
    const row = measureTask.current.get(rowKey) ?? new Map<Key, () => number | undefined>()
    row.set(key, height)
    measureTask.current.set(rowKey, row)
  }, [])

  useLayoutEffect(() => {
    if (!nodeHeightValid()) return
    let needRender = false
    measureTask.current.forEach((currentRow, rowKey) => {
      const row = rowHeightByRowKeyRef.current.get(rowKey) ?? new Map<Key, number>()
      currentRow.forEach((getHeight, key) => {
        const height = getHeight()
        if (debugKey === 'demo1') {
          if (height === 0) {
            // console.log('demo1.row.0', rowKey, key, height)
            debugger
            getHeight()
          }
        }
        const oldHeight = row.get(key)
        if (height != null && (oldHeight == null || oldHeight !== height)) {
          needRender = true
          row.set(key, height)
          if (debugKey === 'demo1') {
            if (height === 0) {
              debugger
            }
            // console.log(rowKey, key, oldHeight, height)
          }
        }
        rowHeightByRowKeyRef.current.set(rowKey, row)
      })
    })
    measureTask.current.clear()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (needRender || dataSource.length !== rowHeights.length) {
      needRender = false
      setRowHeightByRowKey(new Map(rowHeightByRowKeyRef.current))
      setRowHeights(calcRowHeights())
      rowRectsRef.current = calcRowRects()
    }
  })

  return {
    rowHeightByRowKey,
    rowHeightByRowKeyRef,
    setRowHeightByRowKey: measureRowHeightByRowKey,
    rowHeights,
    rowRectsRef,
  }
}
