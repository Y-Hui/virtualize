import type { ColumnDescriptor } from '@are-visual/virtual-table'
import type { CSSProperties, FC, ReactNode } from 'react'
import { Colgroup, useScrollSynchronize } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useState } from 'react'

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
  defaultColumnWidth: number
}

const Footer: FC<FooterProps> = (props) => {
  const { className, style, zIndex, bottom, columns, fixed, children, defaultColumnWidth } = props

  const [scrollbarHeight] = useState(() => getScrollbarSize().height)
  const wrapperRef = useScrollSynchronize<HTMLDivElement>('virtual-table-summary')

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
        <Colgroup columns={columns} defaultColumnWidth={defaultColumnWidth} />
        <tfoot className="virtual-table-summary-tfoot">{children}</tfoot>
      </table>
    </div>
  )
}

export default Footer
