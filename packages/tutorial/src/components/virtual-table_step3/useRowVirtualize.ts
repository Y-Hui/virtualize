/* eslint-disable react-compiler/react-compiler */
import type { ScrollElement } from './utils/dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from './utils/dom'

interface UseRowVirtualizeArgs<T> {
  dataSource?: T[]
  estimateSize: number
  overscan?: number
  getScrollContainer: () => ScrollElement | undefined
}

interface RowRect {
  index: number
  top: number
  bottom: number
  height: number
}

export function useRowVirtualize<T>(args: UseRowVirtualizeArgs<T>) {
  const { dataSource, estimateSize, getScrollContainer, overscan = 0 } = args

  const rowHeights = useRef<number[]>([])
  const fillRowHeights = () => {
    const len = dataSource?.length ?? 0
    for (let i = 0; i < len; i++) {
      const target = rowHeights.current[i] as number | undefined
      if (target == null) {
        rowHeights.current[i] = estimateSize
      }
    }
    rowHeights.current = rowHeights.current.slice(0, len)
  }
  fillRowHeights()

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const initial = useRef(false)
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
    }

    const onScroll = () => {
      const scrollTop = getScrollTop()
      updateBoundary(scrollTop)
    }
    container.addEventListener('scroll', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [estimateSize, getScrollContainer, overscan])

  const dataSlice = useMemo(() => {
    if (dataSource == null) {
      return undefined
    }
    return dataSource.slice(startIndex, endIndex)
  }, [dataSource, endIndex, startIndex])

  const sum = (startIndex: number, endIndex?: number) => {
    return rowHeights.current.slice(startIndex, endIndex).reduce((a, b) => a + b, 0)
  }

  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)

  return { dataSource: dataSlice, topBlank, bottomBlank }
}
