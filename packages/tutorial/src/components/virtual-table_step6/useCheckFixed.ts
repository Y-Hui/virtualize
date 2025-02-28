import type { RefObject } from 'react'
import type { ColumnType } from './types'
import { useEffect, useState } from 'react'

interface UseCheckFixedArgs {
  columns: ColumnType<any>[]
  bodyScrollContainer: RefObject<HTMLElement>
}

export function useCheckFixed(args: UseCheckFixedArgs) {
  const { columns, bodyScrollContainer } = args

  const [hasFixedLeft, setHasFixedLeft] = useState(false)
  const [hasFixedRight, setHasFixedRight] = useState(false)

  const hasFixedLeftColumn = columns.some((x) => x.fixed === 'left')
  const hasFixedRightColumn = columns.some((x) => x.fixed === 'right')

  useEffect(() => {
    const node = bodyScrollContainer.current
    if (node == null) return
    const onCheckHasFixedEdge = () => {
      const { scrollLeft, clientWidth, scrollWidth } = node
      // 左侧固定列存在，scrollLeft == 0，就不需要显示阴影
      if (hasFixedLeftColumn) {
        setHasFixedLeft(scrollLeft !== 0)
      }

      // 右侧固定列存在，scrollLeft == MAX，就不需要显示阴影
      if (hasFixedRightColumn) {
        setHasFixedRight(!(scrollLeft + clientWidth >= scrollWidth))
      }
    }

    // 初始化时，先计算一次，因为 scrollLeft 可能不是 0，那就要及时显示
    onCheckHasFixedEdge()

    node.addEventListener('scroll', onCheckHasFixedEdge)
    return () => {
      node.removeEventListener('scroll', onCheckHasFixedEdge)
    }
  }, [bodyScrollContainer, hasFixedLeftColumn, hasFixedRightColumn])

  return { hasFixedLeft, hasFixedRight }
}
