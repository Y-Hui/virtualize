/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScrollElement } from '../../utils/dom'
import type { RowRect } from './useRowRectManager'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from '../../utils/dom'
import { onResize } from '../utils/on-resize'
import { anchorQuery, useRowRectManager } from './useRowRectManager'

interface UseRowVirtualizeOptions<T = any> {
  dataSource: T[]
  getScroller: () => ScrollElement | undefined
  estimatedRowHeight: number
  overscan: number
}

export function useRowVirtualize<T = any>(options: UseRowVirtualizeOptions<T>) {
  const { dataSource: rawData, getScroller, estimatedRowHeight, overscan } = options

  const hasData = !Array.isArray(rawData) ? false : rawData.length > 0

  // 滚动容器内可见数据条数
  const visibleCount = useRef(0)

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  // 锚点元素，当前虚拟列表中，最接近滚动容器顶部的元素
  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimatedRowHeight,
    top: 0,
    bottom: estimatedRowHeight,
  })

  const {
    rowHeightList,
    rects,
    updateRowHeight,
    sum,
  } = useRowRectManager({
    itemCount: rawData.length,
    estimatedRowHeight,
    onChange(index, _height, rowRects) {
      if (anchorRef.current.index === index) {
        anchorRef.current = rowRects[index]
      }
    },
  })

  // 初始化时根据滚动容器计算 visibleCount
  useLayoutEffect(() => {
    const scrollerContainer = getScroller()
    if (scrollerContainer == null) return

    const getContainerHeight = () => {
      let containerHeight = 0
      if (isWindow(scrollerContainer) || isRoot(scrollerContainer)) {
        containerHeight = window.innerHeight
      } else {
        const element = getScrollElement(scrollerContainer)
        containerHeight = element.getBoundingClientRect().height
      }
      return containerHeight
    }

    const getScrollTop = () => {
      let result = 0
      if (isWindow(scrollerContainer) || isRoot(scrollerContainer)) {
        result = window.scrollY
      } else {
        const element = getScrollElement(scrollerContainer)
        result = element.scrollTop
      }
      return result
    }

    const updateBoundary = (scrollerContainerHeight: number) => {
      const scrollTop = getScrollTop()

      let nextStartIndex = 0
      // 判断一下当前滚动位置，计算 startIndex（场景：SPA 页面切换且渲染非异步数据）
      if (scrollTop >= estimatedRowHeight) {
        nextStartIndex = Math.max(Math.floor(scrollTop / estimatedRowHeight) - 1 - overscan, 0)
      }

      const count = Math.ceil(scrollerContainerHeight / estimatedRowHeight)
      const nextEndIndex = nextStartIndex + count + overscan

      setStartIndex(nextStartIndex)
      setEndIndex(nextEndIndex)

      return { count, nextStartIndex, nextEndIndex }
    }

    if (visibleCount.current === 0) {
      const { count } = updateBoundary(getContainerHeight())
      visibleCount.current = count
    }

    return onResize(scrollerContainer, (rect) => {
      const { count } = updateBoundary(rect.height)
      visibleCount.current = count
    })
  }, [estimatedRowHeight, getScroller, hasData, overscan])

  const scrollTopRef = useRef(0)
  // 滚动时计算 visibleCount
  useEffect(() => {
    const container = getScroller()
    if (container == null) return

    const updateBoundary = (scrollTop: number) => {
      const anchor = anchorQuery(rects(), scrollTop)
      if (anchor != null) {
        anchorRef.current = anchor
        setStartIndex(Math.max(0, anchor.index - overscan))
        setEndIndex(anchor.index + visibleCount.current + overscan)
      }
    }

    const onScroll = (e: Event) => {
      const scrollElement = getScrollElement(e.target)
      const { scrollTop } = scrollElement

      // 如果滚动距离比较小，没有超出锚点元素的边界，就不需要计算 startIndex、endIndex 了
      // 向下滚动
      if (scrollTop > scrollTopRef.current) {
        if (scrollTop > anchorRef.current.bottom) {
          updateBoundary(scrollTop)
        }
      } else if (scrollTop < scrollTopRef.current) {
        // 向上滚动
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
  }, [getScroller, overscan, rects])

  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)

  const dataSlice = useMemo(() => {
    return rawData.slice(startIndex, endIndex)
  }, [rawData, startIndex, endIndex])

  return {
    rowHeightList,
    updateRowHeight,

    topBlank,
    bottomBlank,

    dataSlice,
    startIndex,
    endIndex,
  }
}
