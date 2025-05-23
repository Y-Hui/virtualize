import type { CSSProperties, FC, RefObject } from 'react'
import { onResize, useScrollSynchronize } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export interface ScrollBarProps {
  className?: string
  style?: CSSProperties
  bottom?: number | string
  zIndex?: number
  bodyRef: RefObject<HTMLTableElement>
}

const ScrollBar: FC<ScrollBarProps> = (props) => {
  const { className, style, bottom, zIndex, bodyRef } = props

  const wrapperRef = useScrollSynchronize<HTMLDivElement>('virtual-table-sticky-bottom-scroll')

  const [width, setWidth] = useState(0)
  useEffect(() => {
    const body = bodyRef.current
    if (body == null) return
    return onResize(body, ({ width }) => {
      if (width === 0) return
      setWidth(width)
    })
  }, [bodyRef])

  const [size] = useState(getScrollbarSize)

  return (
    <div
      className={clsx('virtual-table-sticky-scroll', className)}
      style={{
        ...style,
        // @ts-expect-error 使用 css 变量覆盖 bottom，而不是 bottom，这样需要高优先级的时候，就可以使用 style 代替
        '--virtual-table-sticky-scroll-bottom': Number.isFinite(bottom) ? `${bottom}px` : bottom,
        'paddingTop': size.height > 0 ? 0 : 15,
        'marginTop': size.height > 0 ? 0 : size.height * -1,
        'height': size.height + 1,
        zIndex,
      }}
      ref={wrapperRef}
    >
      <div className="virtual-table-sticky-scroll-bar" style={{ width }}></div>
    </div>
  )
}

export default ScrollBar
