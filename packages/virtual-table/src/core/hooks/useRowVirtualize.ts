/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScrollElement } from '../../utils/dom'
import type { NecessaryProps } from '../internal'
import type { RowRect } from './useRowHeight'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { getScrollElement, isRoot, isWindow } from '../../utils/dom'
import { onResize } from '../utils/on-resize'
import { NormalRowHeightKey, useRowHeight } from './useRowHeight'

interface UseRowVirtualizeOptions<T = any> {
  debugKey?: string
  nodeHeightValid: () => boolean
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

export function useRowVirtualize<T = any>(options: UseRowVirtualizeOptions<T>) {
  const {
    debugKey,
    nodeHeightValid,
    getOffsetTop,
    rowKey,
    dataSource: rawData,
    getScroller,
    estimateSize,
    overscan,
  } = options

  const {
    rowHeightByRowKeyRef,
    setRowHeightByRowKey,
    rowRectsRef,
    rowHeights,
  } = useRowHeight({
    dataSource: rawData,
    rowKey,
    debugKey,
    estimateSize,
    nodeHeightValid,
  })

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  // 解决 PR #5 的问题
  // 在 scroll 事件中获取到当前的 node 高度为 0 就认为节点不可见，
  // 就不需要触发 updateBoundary
  // 把它推迟到下一次渲染检测 node 高度不为 0 的时候
  // 场景：
  // <Tabs /> 组件展示两个 Tab
  // tab1 是以 window 为滚动容器的 table
  // tab2 仅展示一行文字
  // 滚动 tab1 让 startIndex 变化（假设是100），再切换到 tab2，此时由于内容变了
  // 滚动条被重置为 0，再切换回 tab1 的时候，需要重新计算 startIndex，
  // 否则 startIndex 还停留在上一次的 100，造成白屏
  const reUpdateBoundary = useRef<() => void>()
  useLayoutEffect(() => {
    const reUpdate = reUpdateBoundary.current
    if (reUpdate == null) return
    if (nodeHeightValid()) {
      reUpdate()
      reUpdateBoundary.current = undefined
    }
  })

  const dataSlice = useMemo(() => {
    return rawData.slice(startIndex, endIndex)
  }, [rawData, startIndex, endIndex])

  // 锚点元素，当前虚拟列表中，最接近滚动容器顶部的元素
  const anchorRef = useRef<RowRect>({
    index: 0,
    height: estimateSize,
    top: 0,
    bottom: estimateSize,
  })

  // 场景：分页请求 Table 数据，滚动到底部，查看下一页
  // dataSource重置为空数组
  // 网络请求结束后再 setDataSource
  // 此时的 startIndex 和 endIndex 还是上一页的结果，导致渲染出现空白
  // 所以 dataSource.length 发生改变，重新计算 startIndex、endIndex
  const updateBoundaryFlagDep = rawData.length

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
      const anchor = anchorQuery(rowRectsRef.current, scrollTop)
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
          if (!nodeHeightValid()) {
            reUpdateBoundary.current = () => updateBoundary(scrollTop)
          } else {
            updateBoundary(scrollTop)
          }
        }
      } else {
        if (scrollTop < anchorRef.current.top) {
          if (!nodeHeightValid()) {
            reUpdateBoundary.current = () => updateBoundary(scrollTop)
          } else {
            updateBoundary(scrollTop)
          }
        }
      }
      scrollTopRef.current = scrollTop
    }

    let prevHeight = 0
    const stopListen = onResize(container, (rect) => {
      // 使用 div 作为滚动容器时，并且放置在 <Tabs> 组件内，当前 tab 切换到非激活状态时，
      // 父元素会被设置 display:none，导致容器高度变为 0，导致调用 updateBoundary
      // 来回切换会发现每一次都会往下移动几个 row
      // 这里加一个判断，rect.height 为0时，不处理本次的 resize 事件（这就是 display:none）
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
  }, [estimateSize, getOffsetTop, getScroller, overscan, updateBoundaryFlagDep, nodeHeightValid, rowRectsRef])

  const sum = (startIndex: number, endIndex?: number) => {
    return rowHeights.slice(startIndex, endIndex).reduce((a, b) => a + b, 0)
  }

  // TODO: React Compiler 测试 topBlank 和 bottomBlank
  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)

  return {
    startIndex,
    endIndex,

    rowHeightList: rowHeights,
    rowHeightByRowKeyRef,
    setRowHeightByRowKey,

    topBlank,
    bottomBlank,

    dataSlice,
  }
}

export { NormalRowHeightKey }
