import type { Key, RefObject } from 'react'
import type { ColumnDescriptor, ColumnType } from './types'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { isWindow } from './utils/dom'
import { getKey } from './utils/get-key'

interface UseColumnVirtualizeOptions<T> {
  estimateSize: number
  overscan: number
  columns: ColumnType<T>[]
  bodyWrapper: RefObject<HTMLDivElement>
  columnWidths: Map<Key, number>
  disabled?: boolean
}

interface Rect {
  index: number
  width: number
  left: number
  right: number
}

function anchorQuery(rects: Rect[], scrollLeft: number) {
  let left = 0
  let right = rects.length - 1
  let index = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (rects[mid].right > scrollLeft) {
      index = mid
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  if (index === -1) {
    return undefined
  }

  return rects[index]
}

function findFirstFixedRightIndex<T>(columns: ColumnType<T>[]) {
  let index = -1
  for (let i = columns.length - 1; i >= 0; i--) {
    const column = columns[i]
    if (column.fixed === 'right') {
      index = i
    } else {
      break
    }
  }
  return index
}

function findLastFixedLeftIndex<T>(columns: ColumnType<T>[]) {
  let result = -1
  for (let i = 0; i < columns.length; i += 1) {
    if (columns[i].fixed === 'left') {
      result = i
    }
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useStableFn<T extends Function>(callback: T): T {
  const fn = useRef<T | null>(null)
  useLayoutEffect(() => {
    fn.current = callback
  }, [callback])

  const stableFn = useCallback((...args: unknown[]) => {
    return fn.current?.(...args) as unknown
  }, []) as unknown as T

  return stableFn
}

export function useColumnVirtualize<T>(options: UseColumnVirtualizeOptions<T>) {
  const {
    estimateSize,
    overscan,
    columns: rawColumns,
    bodyWrapper,
    columnWidths,
    disabled,
  } = options

  const rects = useMemo(() => {
    if (disabled) {
      return []
    }
    let left = 0
    return rawColumns.map((column, index): Rect => {
      const key = getKey(column)
      const width = columnWidths.get(key) ?? estimateSize
      const right = left + width
      const rect: Rect = {
        index,
        width,
        left,
        right,
      }

      left = right
      return rect
    })
  }, [rawColumns, columnWidths, estimateSize, disabled])

  // 找到左右固定列的边界
  const lastFixedLeftIndex = findLastFixedLeftIndex(rawColumns)
  const firstFixedRightIndex = findFirstFixedRightIndex(rawColumns)

  const leftKey = lastFixedLeftIndex > -1 ? getKey(rawColumns[lastFixedLeftIndex]) : null
  const rightKey = firstFixedRightIndex > -1 ? getKey(rawColumns[firstFixedRightIndex]) : null

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const columnSlice = useMemo(() => {
    if (disabled) {
      return rawColumns
    }
    const result = [
      ...rawColumns.slice(0, lastFixedLeftIndex + 1),
      ...rawColumns.slice(startIndex, endIndex),
      ...rawColumns.slice(firstFixedRightIndex),
    ]
    const unionKey = new Set<Key>()
    return result.filter((column) => {
      const key = getKey(column)
      if (unionKey.has(key)) {
        return false
      }
      unionKey.add(key)
      return true
    })
  }, [disabled, rawColumns, startIndex, endIndex, lastFixedLeftIndex, firstFixedRightIndex])

  const sum = (startIndex: number, endIndex?: number) => {
    return rects.slice(startIndex, endIndex).reduce((a, b) => a + b.width, 0)
  }
  const fixedLeftWidth = lastFixedLeftIndex > -1 ? sum(0, lastFixedLeftIndex + 1) : 0
  const fixedRightWidth = firstFixedRightIndex > -1 ? sum(firstFixedRightIndex) : 0

  // 设置 column.fixed 时，对应列将不会虚拟化，所以 blank 需要去除这些列的宽度
  const leftBlank = Math.max(0, sum(0, startIndex) - fixedLeftWidth)
  const rightBlank = Math.max(0, sum(endIndex) - fixedRightWidth)

  const descriptor = useMemo(() => {
    return columnSlice.reduce<ColumnDescriptor<T>[]>((result, column, index) => {
      const key = getKey(column)
      if (key === leftKey) {
        result.push({ type: 'normal', key, column })
        result.push({ type: 'blank', key: '_blank_left', width: leftBlank })
      } else if (leftKey == null && index === 0) {
        result.push({ type: 'blank', key: '_blank_left', width: leftBlank })
        result.push({ type: 'normal', key, column })
      } else if (key === rightKey) {
        result.push({ type: 'blank', key: '_blank_right', width: rightBlank })
        result.push({ type: 'normal', key, column })
      } else if (rightKey == null && index === columnSlice.length - 1) {
        result.push({ type: 'normal', key, column })
        result.push({ type: 'blank', key: '_blank_right', width: rightBlank })
      } else {
        result.push({ type: 'normal', key, column })
      }
      return result
    }, [])
  }, [columnSlice, leftKey, rightKey, leftBlank, rightBlank])

  // 锚点元素
  const anchorRef = useRef<Rect>({
    index: 0,
    width: estimateSize,
    left: 0,
    right: estimateSize,
  })

  const findAnchorRef = useStableFn((scrollLeft: number) => {
    return anchorQuery(rects, scrollLeft)
  })

  const updateBoundary = useStableFn((scrollLeft: number, count: number) => {
    const anchor = findAnchorRef(scrollLeft)
    if (anchor != null) {
      anchorRef.current = anchor
      setStartIndex(Math.max(0, anchor.index - overscan))
      setEndIndex(anchor.index + count + overscan)
    }
  })

  // 用来判断滚动方向
  const scrollLeftRef = useRef(0)
  useEffect(() => {
    if (disabled) return

    const scrollContainer = bodyWrapper.current
    if (scrollContainer == null) return

    const containerWidth = scrollContainer.offsetWidth
    let count = Math.ceil(containerWidth / estimateSize)

    const updateCount = (containerHeight: number) => {
      count = Math.ceil(containerHeight / estimateSize)
    }

    const getSize = () => {
      if (isWindow(scrollContainer)) {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      }
      return {
        width: scrollContainer.offsetWidth,
        height: scrollContainer.offsetHeight,
      }
    }

    const onScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft
      // 滚动条向右移动(界面向左运动)
      const isScrollRight = scrollLeft > scrollLeftRef.current
      if (isScrollRight) {
        if (scrollLeft > anchorRef.current.right) {
          updateBoundary(scrollLeft, count)
        }
      } else {
        if (scrollLeft < anchorRef.current.left) {
          updateBoundary(scrollLeft, count)
        }
      }

      scrollLeftRef.current = scrollLeft
    }

    scrollContainer.addEventListener('scroll', onScroll)

    updateCount(getSize().width)
    updateBoundary(scrollContainer.scrollLeft, count)

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll)
    }
  }, [bodyWrapper, estimateSize, overscan, disabled, updateBoundary])

  return { columns: columnSlice, descriptor }
}
