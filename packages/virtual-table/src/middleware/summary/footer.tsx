import type { ColumnDescriptor } from '@are-visual/virtual-table'
import type { CSSProperties, FC, ReactNode } from 'react'
import { Colgroup, useHorizontalScrollContext } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export interface FooterProps {
  className?: string
  style?: CSSProperties
  /** Summary 位于底部，且设置 fixed 时生效 */
  zIndex?: number
  /** Summary 位于底部，且设置 fixed 时生效 */
  bottom?: number | string
  columns: ColumnDescriptor[]
  fixed?: boolean
  children?: ReactNode
}

const Footer: FC<FooterProps> = (props) => {
  const { className, style, zIndex, bottom, columns, fixed, children } = props

  const { listen, notify } = useHorizontalScrollContext()
  const [scrollbarHeight] = useState(() => getScrollbarSize().height)

  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = wrapperRef.current
    if (node == null) return
    const key = 'virtual-table-summary'
    const onScroll = () => {
      notify(key, { scrollLeft: () => node.scrollLeft, node })
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

  return (
    <div
      className={clsx(
        'virtual-table-summary-wrapper',
        fixed && 'virtual-table-summary-sticky-bottom virtual-table-summary-top-border',
        className,
      )}

      style={{
        ...(fixed
          ? {
              '--virtual-table-summary-z-index': zIndex,
              '--virtual-table-summary-sticky-bottom': Number.isFinite(bottom) ? `${bottom}px` : bottom,
            }
          : {}),
        ...style,
        paddingBottom: scrollbarHeight,
      }}
      ref={wrapperRef}
    >
      <table className="virtual-table-summary">
        <Colgroup columns={columns} />
        <tfoot className="virtual-table-summary-tfoot">{children}</tfoot>
      </table>
    </div>
  )
}

export default Footer
