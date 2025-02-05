import { useCallback, useRef } from 'react'
import { useStableFn } from './useStableFn'

export interface RowRect {
  index: number
  height: number
  top: number
  bottom: number
}

export interface UseRowRectManagerOptions {
  itemCount: number
  /** 预计每行高度 */
  estimateSize: number
  onChange?: (index: number, height: number, rects: RowRect[]) => void
}

export function useRowRectManager(options: UseRowRectManagerOptions) {
  const { itemCount, estimateSize, onChange } = options
  const rowHeightList = useRef<number[]>([])

  const calc = () => {
    for (let i = 0; i < itemCount; i += 1) {
      const target = rowHeightList.current[i] as number | undefined
      if (target == null) {
        rowHeightList.current[i] = estimateSize
      }
    }
    rowHeightList.current = rowHeightList.current.slice(0, itemCount)
  }

  // eslint-disable-next-line react-compiler/react-compiler
  calc()

  // const initialCount = useRef(itemCount)
  // const [, forceUpdate] = useReducer((x) => !x, false)

  // useLayoutEffect(() => {
  //   for (let i = 0; i < itemCount; i += 1) {
  //     const target = rowHeightList.current[i]
  //     if (target == null) {
  //       rowHeightList.current[i] = estimatedRowHeight
  //     }
  //   }

  //   // 数据量骤减时如果 row 数量不匹配则会导致容器高度错误
  //   rowHeightList.current = rowHeightList.current.slice(0, itemCount)

  //   // 这里的 useLayoutEffect 是为了在第一次渲染时，根据数据条数预先填充 row 的高度，这样内容足够高，容器才能滚动
  //   // 但是 dataSource 一般是异步获取的，第一次渲染时，length 是空的，所以无法进行填充，这样可能导致容器不能滚动
  //   // 所以 dataSource 有数据后，再填充一次，但是因为 useLayoutEffect 是渲染结束后才调用的，此时填充数据还是导致容器不能滚动，
  //   // 所以，只在第一次 dataSource 不为空时强制触发一次更新
  //   // 可能正因为这一次强制渲染，所以 VirtualTable 内部很多组件可能多次渲染。尝试优化为 calc 函数
  //   if (initialCount.current === 0 && itemCount > 0) {
  //     initialCount.current = itemCount
  //     forceUpdate()
  //   }
  // }, [itemCount, estimatedRowHeight])

  const rectList = useRef<RowRect[]>([])
  const updateRectList = () => {
    const result: RowRect[] = []
    let top = 0
    rowHeightList.current.forEach((item, index) => {
      if (index !== 0) {
        top += item
      }
      result.push({ index, height: item, top, bottom: top + item })
    })
    rectList.current = result
  }

  // DOM 渲染结束后，进行高度测量，再修改 rowHeightList
  // 小心陷阱：当 table 父元素为 display: none 时，依然会触发 updateRowHeight 函数，并设置高度为 0
  const updateRowHeight = useStableFn((index: number, height: number) => {
    rowHeightList.current[index] = height
    updateRectList()
    onChange?.(index, height, rectList.current)
  })

  const sum = (startIndex: number, endIndex?: number) => {
    return rowHeightList.current.slice(startIndex, endIndex).reduce((a, b) => a + b, 0)
  }

  return {
    rowHeightList,
    updateRowHeight,
    sum,
    rects: useCallback(() => rectList.current, []),
  }
}
