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
  const { addShouldSyncElement } = useHorizontalScrollContext()

  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrapperNode = wrapperRef.current
    if (wrapperNode == null) return
    return addShouldSyncElement('virtual-table-sticky-bottom-scroll', wrapperNode)
  }, [addShouldSyncElement])

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
