/* eslint-disable react-compiler/react-compiler */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Key, MutableRefObject } from 'react'
import type { ScrollElement } from '../../utils/dom'
import type { NecessaryProps } from '../internal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from '../../utils/dom'
import { getRowKey } from '../utils/get-key'
import { onResize } from '../utils/on-resize'

export interface RowRect {
  index: number
  height: number
  top: number
  bottom: number
}

interface UseRowVirtualizeOptions<T = any> {
  getOffsetTop: () => number
  dataSource: T[]
  rowKey: NecessaryProps<T>['rowKey']
  getScroller: () => ScrollElement | undefined
  estimateSize: number
  overscan: number
}

function anchorQuery(rects: RowRect[], scrollTop: number) {
  let left = 0
  let right = rects.length - 1
  let index = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (rects[mid].bottom > scrollTop) {
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

export const NormalRowHeightKey = 'NormalRow'

export function useRowVirtualize<T = any>(options: UseRowVirtualizeOptions<T>) {
  const {
    getOffsetTop,
    rowKey,
    dataSource: rawData,
    getScroller,
    estimateSize,
    overscan,
  } = options

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const dataSlice = useMemo(() => {
    return rawData.slice(startIndex, endIndex)
  }, [rawData, startIndex, endIndex])

  /**
   * 记录的所有行高信息
   * 一个 Row 可能有多个行高。例如：默认情况下，只有一个行高，展开后，展开面板的高度也被认为是同一个 Row 的
   * 所以可展开时，行高有多个，所有行高之和，则为 Row 的高度
   * 行高之间使用唯一的 key 作为区分
   * Record<rowKey, Map<key, height>>
   */
  const rowHeightByRowKey = useRef(new Map<Key, Map<Key, number>>())
  const setRowHeightByRowKey = useCallback((rowKey: Key, key: Key, height: number) => {
    const target = rowHeightByRowKey.current.get(rowKey) ?? new Map<Key, number>()
    target.set(key, height)
    rowHeightByRowKey.current.set(rowKey, target)
  }, [])

  const getAllRowHeights = () => {
    const heights: number[] = []
    rawData.forEach((item) => {
      const key = getRowKey(item, rowKey)
      const row = rowHeightByRowKey.current.get(key)
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

  // 行高信息（先填充预估高度，DOM渲染后再更新成实际高度）
  const fillRowHeights = () => {
    if (rawData.length === 0) {
      rowHeightByRowKey.current.clear()
      return
    }
    rawData.forEach((item) => {
      const key = getRowKey(item, rowKey)
      const row = rowHeightByRowKey.current.get(key) ?? new Map<Key, number>()
      const target = row.get(NormalRowHeightKey)
      if (target == null) {
        row.set(NormalRowHeightKey, estimateSize)
      }
      rowHeightByRowKey.current.set(key, row)
    })
  }
  fillRowHeights()

  // 强制设置类型为 number[]，在后面会初始化，只是为了减少 getAllRowHeights 的调用
  const rowHeights = useRef<number[]>() as MutableRefObject<number[]>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rowHeights.current == null) {
    rowHeights.current = getAllRowHeights()
  } else if (rawData.length !== rowHeights.current.length) {
    // 这个判断条件主要是为了处理：空数据切换为有数据时 tbody 上 padding 缺失的问题
    rowHeights.current = getAllRowHeights()
  }

  // 布局信息（也就是锚点元素需要的信息，top,bottom,height,index）
  const rowRects = useRef<RowRect[]>([])
  const updateRowRects = () => {
    const { rects } = rawData.reduce((result, rowData, index) => {
      const key = getRowKey(rowData, rowKey)

      let height = 0
      rowHeightByRowKey.current.get(key)?.forEach((item) => {
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
    rowRects.current = rects
  }

  /** 刷新布局信息，行高变化的时候调用，要重新组织布局信息(rowRects) */
  const flushLayout = (fn?: () => void) => {
    fn?.()
    updateRowRects()
    // 组件渲染后会触发 flushLayout，表示行高有更新所以需要更新一下 rowHeights
    // 避免展开行之后记录的还是之前的行高信息，否则滚动后底部会出现空白区域
    rowHeights.current = rowRects.current.map((x) => x.height)
  }

  // 锚点元素，当前虚拟列表中，最接近滚动容器顶部的元素
  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimateSize,
    top: 0,
    bottom: estimateSize,
  })

  // 用来判断滚动方向
  const scrollTopRef = useRef(0)
  const initial = useRef(false)
  useEffect(() => {
    const container = getScroller()
    if (container == null) return

    let count = 0

    const getScrollTop = () => {
      const offsetTop = getOffsetTop()
      let result = 0
      if (isWindow(container) || isRoot(container)) {
        result = window.scrollY
      } else {
        const element = getScrollElement(container)
        result = element.scrollTop
      }
      return Math.max(result - offsetTop, 0)
    }

    const calcCount = (scrollerContainerHeight: number) => {
      const prevCount = count
      count = Math.ceil(scrollerContainerHeight / estimateSize)
      return { prevCount }
    }

    const updateBoundary = (scrollTop: number) => {
      const anchor = anchorQuery(rowRects.current, scrollTop)
      if (anchor != null) {
        anchorRef.current = anchor
        setStartIndex(Math.max(0, anchor.index - overscan))
        setEndIndex(anchor.index + count + overscan)
      }
    }

    const onScroll = (e: Event) => {
      const offsetTop = getOffsetTop()
      const scrollElement = getScrollElement(e.target)
      const scrollTop = Math.max(0, scrollElement.scrollTop - offsetTop)

      // 是否为向下滚动
      const isScrollDown = scrollTop > scrollTopRef.current

      if (isScrollDown) {
        // 如果滚动距离比较小，没有超出锚点元素的边界，就不需要计算 startIndex、endIndex 了
        if (scrollTop > anchorRef.current.bottom) {
          updateBoundary(scrollTop)
        }
      } else {
        if (scrollTop < anchorRef.current.top) {
          updateBoundary(scrollTop)
        }
      }

      scrollTopRef.current = scrollTop
    }

    let prevHeight = 0
    const stopListen = onResize(container, (rect) => {
      // 处理父元素 display:none 容器高度丢失，导致显示 row 不准确
      if (rect.height === prevHeight || rect.height === 0) {
        return
      }
      prevHeight = rect.height
      calcCount(rect.height)
      const scrollTop = getScrollTop()
      if (!initial.current) {
        initial.current = true
        let nextStartIndex = 0
        // 判断一下当前滚动位置，计算 startIndex（场景：SPA 页面切换且渲染非异步数据）
        if (scrollTop >= estimateSize) {
          nextStartIndex = Math.max(Math.floor(scrollTop / estimateSize) - 1 - overscan, 0)
        }
        const nextEndIndex = nextStartIndex + count + overscan
        setStartIndex(nextStartIndex)
        setEndIndex(nextEndIndex)
      } else {
        updateBoundary(scrollTop)
      }
    })

    container.addEventListener('scroll', onScroll)
    return () => {
      stopListen()
      container.removeEventListener('scroll', onScroll)
    }
  }, [estimateSize, getOffsetTop, getScroller, overscan])

  const sum = (startIndex: number, endIndex?: number) => {
    return rowHeights.current.slice(startIndex, endIndex).reduce((a, b) => a + b, 0)
  }
  // TODO: React Compiler 测试 topBlank 和 bottomBlank
  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)

  return {
    startIndex,
    endIndex,

    rowHeightList: rowHeights,
    flushLayout,
    rowHeightByRowKey,
    setRowHeightByRowKey,

    topBlank,
    bottomBlank,

    dataSlice,
  }
}
