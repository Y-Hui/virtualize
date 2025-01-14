import type { RefObject } from 'react'
import type { ScrollElement } from '../../utils/dom'
import { useLayoutEffect, useRef, useState } from 'react'
import { isWindow } from '../../utils/dom'

interface CalcSizeOptions {
  getScroller: () => ScrollElement | undefined
  root: RefObject<HTMLDivElement>
}

export function useCalcSize(options: CalcSizeOptions) {
  const { getScroller, root } = options

  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0)

  const [tableWidth, setTableWidth] = useState(0)
  const [tableHeight, setTableHeight] = useState(0)

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

  return {
    scrollContainerWidth,
    scrollContainerHeight,
    tableWidth,
    tableHeight,
  }
}
