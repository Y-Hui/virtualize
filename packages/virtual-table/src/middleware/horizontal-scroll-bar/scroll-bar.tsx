import './scroll-bar.scss'

import { type FC, useEffect, useRef, useState } from 'react'

import { useHorizontalScrollContext } from '../../core'
import { composeRef } from '../../utils/ref'
import { getScrollbarSize } from './getScrollbarSize'

const ScrollBar: FC = () => {
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

  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const value = getScrollbarSize()
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setSize(value)
  }, [])

  return (
    <div
      className="virtual-table-sticky-scroll"
      style={{
        paddingTop: size.height > 0 ? 0 : 15,
        marginTop: size.height * -1,
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
