import type { RefObject } from 'react'
import type { ScrollElement } from '../../utils/dom'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { isWindow } from '../../utils/dom'

export interface CalcSizeOptions {
  getScroller: () => ScrollElement | undefined
  root: RefObject<HTMLDivElement>
}

export function useCalcSize(options: CalcSizeOptions) {
  const { getScroller, root } = options

  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0)

  const [tableWidth, setTableWidth] = useState(800) // 设置一个默认值（因为这两个默认值很快就会被覆盖）
  const [tableHeight, setTableHeight] = useState(600) // 设置一个默认值（因为这两个默认值很快就会被覆盖）

  const scrollerContainerRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const scrollerContainer = getScroller()
    if (scrollerContainer == null) return
    let scroller: HTMLElement
    if (isWindow(scrollerContainer)) {
      scroller = document.scrollingElement as HTMLElement
    } else {
      scroller = scrollerContainer
    }
    scrollerContainerRef.current = scroller
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setScrollContainerWidth(width)
      setScrollContainerHeight(height)
    })
    observer.observe(scroller)
    return () => {
      observer.disconnect()
    }
  }, [getScroller])

  useLayoutEffect(() => {
    const node = root.current
    if (node == null) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setTableWidth(width)
      setTableHeight(height)
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [root])

  const state = useMemo(() => {
    return {
      scrollContainerWidth,
      scrollContainerHeight,
      tableWidth,
      tableHeight,
    }
  }, [scrollContainerWidth, scrollContainerHeight, tableWidth, tableHeight])

  return state
}
