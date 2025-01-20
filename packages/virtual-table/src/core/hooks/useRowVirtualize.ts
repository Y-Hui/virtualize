/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { ScrollElement } from '../../utils/dom'
import type { RowRect } from './useRowRectManager'
import { useEffect, useMemo, useRef } from 'react'
import { getScrollElement } from '../../utils/dom'
import { anchorQuery, useRowRectManager } from './useRowRectManager'

interface UseRowVirtualizeOptions<T = any> {
  startIndex: number
  setStartIndex: Dispatch<SetStateAction<number>>
  endIndex: number
  setEndIndex: Dispatch<SetStateAction<number>>
  dataSource: T[]
  getScroller: () => ScrollElement | undefined
  estimatedRowHeight: number
  overscan: number
  visibleRowSize: MutableRefObject<number>
}

// TODO(FixMe): overscan=0、scroll=window、table 上方有元素时，滚动会白屏
export function useRowVirtualize<T = any>(options: UseRowVirtualizeOptions<T>) {
  const {
    startIndex,
    setStartIndex,
    endIndex,
    setEndIndex,
    dataSource: rawData,
    getScroller,
    estimatedRowHeight,
    overscan,
    visibleRowSize,
  } = options

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

  const scrollTopRef = useRef(0)
  // 滚动时计算 visibleRowSize
  useEffect(() => {
    const container = getScroller()
    if (container == null) return

    const updateBoundary = (scrollTop: number) => {
      const anchor = anchorQuery(rects(), scrollTop)
      if (anchor != null) {
        anchorRef.current = anchor
        setStartIndex(Math.max(0, anchor.index - overscan))
        setEndIndex(anchor.index + visibleRowSize.current + overscan)
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
  }, [getScroller, overscan, rects, setEndIndex, setStartIndex, visibleRowSize])

  // TODO: React Compiler 测试 topBlank 和 bottomBlank
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
  }
}
