import type { CSSProperties, FC, RefObject } from 'react'
import { onResize, useHorizontalScrollContext } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export interface ScrollBarProps {
  className?: string
  style?: CSSProperties
  bottom?: number | string
  zIndex?: number
  bodyRef: RefObject<HTMLTableElement>
}

const ScrollBar: FC<ScrollBarProps> = (props) => {
  const { className, style, bottom, zIndex, bodyRef } = props
  const { listen, notify } = useHorizontalScrollContext()

  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = wrapperRef.current
    if (node == null) return
    const key = 'virtual-table-sticky-bottom-scroll'
    const onScroll = () => {
      const nextScrollLeft = node.scrollLeft
      notify(key, nextScrollLeft)
    }
    const dispose = listen(key, (scrollLeft) => {
      node.scrollLeft = scrollLeft
    })
    node.addEventListener('scroll', onScroll)
    return () => {
      node.removeEventListener('scroll', onScroll)
      dispose()
    }
  }, [listen, notify])

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
        paddingTop: size.height > 0 ? 0 : 12,
        marginTop: size.height > 0 ? 0 : size.height * -1,
        height: size.height,
        bottom,
        zIndex,
      }}
      ref={wrapperRef}
    >
      <div className="virtual-table-sticky-scroll-bar" style={{ width }}></div>
    </div>
  )
}

export default ScrollBar
