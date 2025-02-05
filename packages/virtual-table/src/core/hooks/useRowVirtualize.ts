/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { Dispatch, SetStateAction } from 'react'
import type { ScrollElement } from '../../utils/dom'
import type { RowRect } from './useRowRectManager'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from '../../utils/dom'
import { onResize } from '../utils/on-resize'
import { useRowRectManager } from './useRowRectManager'

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

interface UseRowVirtualizeOptions<T = any> {
  getOffsetTop: () => number
  dataSource: T[]
  getScroller: () => ScrollElement | undefined
  estimateSize: number
  overscan: number
}

export function useRowVirtualize<T = any>(options: UseRowVirtualizeOptions<T>) {
  const {
    getOffsetTop,
    dataSource: rawData,
    getScroller,
    estimateSize,
    overscan,
  } = options

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  // 锚点元素，当前虚拟列表中，最接近滚动容器顶部的元素
  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimateSize,
    top: 0,
    bottom: estimateSize,
  })

  const {
    rowHeightList,
    rects,
    updateRowHeight,
    sum,
  } = useRowRectManager({
    itemCount: rawData.length,
    estimateSize,
    onChange(index, _height, rowRects) {
      if (anchorRef.current.index === index) {
        anchorRef.current = rowRects[index]
      }
    },
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
      const anchor = anchorQuery(rects(), scrollTop)
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
  }, [estimateSize, getOffsetTop, getScroller, overscan, rects])

  // TODO: React Compiler 测试 topBlank 和 bottomBlank
  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)

  const dataSlice = useMemo(() => {
    return rawData.slice(startIndex, endIndex)
  }, [rawData, startIndex, endIndex])

  return {
    startIndex,
    endIndex,

    rowHeightList,
    updateRowHeight,

    topBlank,
    bottomBlank,

    dataSlice,
  }
}
