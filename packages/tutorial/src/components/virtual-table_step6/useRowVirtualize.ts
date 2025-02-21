/* eslint-disable react-compiler/react-compiler */
import type { ScrollElement } from './utils/dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from './utils/dom'

interface UseRowVirtualizeArgs<T> {
  dataSource?: T[]
  estimateSize: number
  /** 额外渲染多少条 */
  overscan?: number
  getScrollContainer: () => ScrollElement | undefined
}

interface RowRect {
  index: number
  top: number
  bottom: number
  height: number
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

export function useRowVirtualize<T>(args: UseRowVirtualizeArgs<T>) {
  const { dataSource, estimateSize, getScrollContainer, overscan = 0 } = args

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const dataSlice = useMemo(() => {
    if (dataSource == null) {
      return undefined
    }
    return dataSource.slice(startIndex, endIndex)
  }, [dataSource, endIndex, startIndex])

  // 行高信息（先填充预估高度，DOM渲染后再更新成实际高度）
  const rowHeights = useRef<number[]>([])
  const fillRowHeights = () => {
    const len = dataSource?.length ?? 0
    for (let i = 0; i < len; i++) {
      const target = rowHeights.current[i] as number | undefined
      // 由于 fillRowHeights 是在渲染阶段调用，防止重复渲染时 estimateSize 覆盖了真实 DOM 的高度
      if (target == null) {
        rowHeights.current[i] = estimateSize
      }
    }
    rowHeights.current = rowHeights.current.slice(0, len)
  }
  fillRowHeights()

  // 布局信息（也就是锚点元素需要的信息，top,bottom,height,index）
  const rowRects = useRef<RowRect[]>([])
  const updateRowRectList = (shouldSkip = false) => {
    if (shouldSkip && rowRects.current.length > 0) {
      return
    }
    const { rects } = rowHeights.current.reduce((result, height, index) => {
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

  // 更新行高（真实 DOM 渲染后调用）
  const updateRowHeight = useCallback((index: number, height: number) => {
    const prevHeight = rowHeights.current[index]
    rowHeights.current[index] = height
    updateRowRectList(prevHeight === height)
  }, [])

  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimateSize,
    top: 0,
    bottom: estimateSize,
  })

  const initial = useRef(false)
  const scrollTopRef = useRef(0)
  useEffect(() => {
    const container = getScrollContainer()
    if (container == null) return

    // 当前容器内可以展示多少条数据
    let count = 0

    const updateCount = (containerHeight: number) => {
      count = Math.ceil(containerHeight / estimateSize)
    }

    const getSize = () => {
      if (isWindow(container)) {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      }
      return {
        width: container.offsetWidth,
        height: container.offsetHeight,
      }
    }

    const getScrollTop = () => {
      let result = 0
      if (isWindow(container) || isRoot(container)) {
        result = window.scrollY
      } else {
        const element = getScrollElement(container)
        result = element.scrollTop
      }
      return Math.max(result, 0)
    }

    updateCount(getSize().height)

    // 默认 start、end 都为 0，先初始化
    if (!initial.current) {
      initial.current = true
      const scrollTop = getScrollTop()
      let nextStartIndex = 0
      // 判断一下当前滚动位置，计算 startIndex（场景：SPA 页面切换且渲染非异步数据）
      if (scrollTop >= estimateSize) {
        nextStartIndex = Math.max(Math.floor(scrollTop / estimateSize) - 1 - overscan, 0)
      }
      const nextEndIndex = nextStartIndex + count + overscan
      setStartIndex(nextStartIndex)
      setEndIndex(nextEndIndex)
    }

    const updateBoundary = (scrollTop: number) => {
      // 查找锚点元素
      const anchor = anchorQuery(rowRects.current, scrollTop)
      // anchorQuery() 可以视为 rowRects.cirrent.find 的优化版本
      // const anchor = rowRects.cirrent.find((x) => x.bottom > scrollTop)

      if (anchor != null) {
        anchorRef.current = anchor
        // overscan 是额外渲染多少条
        setStartIndex(Math.max(0, anchor.index - overscan))
        setEndIndex(anchor.index + count + overscan)
      }
    }

    const onScroll = () => {
      const scrollTop = getScrollTop()

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
    container.addEventListener('scroll', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [estimateSize, getScrollContainer, overscan])

  const sum = (startIndex: number, endIndex?: number) => {
    return rowHeights.current.slice(startIndex, endIndex).reduce((a, b) => a + b, 0)
  }

  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)

  return { dataSource: dataSlice, startIndex, topBlank, bottomBlank, updateRowHeight }
}
