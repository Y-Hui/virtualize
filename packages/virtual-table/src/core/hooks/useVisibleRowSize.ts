import type { ScrollElement } from '../../utils/dom'
import { useLayoutEffect, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from '../../utils/dom'
import { onResize } from '../utils/on-resize'

interface UseVisibleRowSizeOptions {
  hasData: boolean
  getScroller: () => ScrollElement | undefined
  estimatedRowHeight: number
  overscan: number
}

export function useVisibleRowSize(options: UseVisibleRowSizeOptions) {
  const { hasData, getScroller, estimatedRowHeight, overscan } = options

  // 滚动容器内可见数据条数
  const visibleRowSize = useRef(0)

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  // 初始化时根据滚动容器计算 visibleRowSize
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

    if (visibleRowSize.current === 0) {
      const { count } = updateBoundary(getContainerHeight())
      visibleRowSize.current = count
    }

    return onResize(scrollerContainer, (rect) => {
      const { count } = updateBoundary(rect.height)
      visibleRowSize.current = count
    })
  }, [estimatedRowHeight, getScroller, hasData, overscan])

  return [
    [startIndex, setStartIndex] as const,
    [endIndex, setEndIndex] as const,
    { visibleRowSize },
  ] as const
}
