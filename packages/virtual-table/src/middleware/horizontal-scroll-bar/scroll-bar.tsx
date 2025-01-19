import type { CSSProperties, FC } from 'react'
import { composeRef, useHorizontalScrollContext } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export interface ScrollBarProps {
  className?: string
  style?: CSSProperties
  bottom?: number | string
  zIndex?: number
}

const ScrollBar: FC<ScrollBarProps> = (props) => {
  const { className, style, bottom, zIndex } = props
  const { addShouldSyncElement } = useHorizontalScrollContext()

  const rootNode = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const node = rootNode.current?.parentElement
    const body = node?.querySelector(
      ':scope > .virtual-table-body-wrapper > .virtual-table-body',
    )
    if (body == null) return

    const observer = new ResizeObserver((entries) => {
      const { width: widthRect } = entries[0].contentRect
      setWidth(widthRect)
    })
    observer.observe(body)
    return () => {
      observer.disconnect()
    }
  }, [])

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
      ref={composeRef((node) => {
        if (node == null) return
        addShouldSyncElement('virtual-table-sticky-bottom-scroll', node)
        // eslint-disable-next-line react-compiler/react-compiler
      }, rootNode)}
    >
      <div className="virtual-table-sticky-scroll-bar" style={{ width }}></div>
    </div>
  )
}

export default ScrollBar
