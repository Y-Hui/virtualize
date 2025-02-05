import type { ColumnDescriptor } from '@are-visual/virtual-table'
import type { FC, ReactNode } from 'react'
import { Colgroup, useHorizontalScrollContext } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export interface FooterProps {
  columns: ColumnDescriptor[]
  fixed?: boolean
  children?: ReactNode
}

const Footer: FC<FooterProps> = (props) => {
  const { columns, fixed, children } = props

  const { addShouldSyncElement } = useHorizontalScrollContext()
  const [scrollbarHeight] = useState(() => getScrollbarSize().height)

  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const wrapperNode = wrapperRef.current
    if (wrapperNode == null) return
    return addShouldSyncElement('virtual-table-summary', wrapperNode)
  }, [addShouldSyncElement])

  return (
    <div
      className={clsx(
        'virtual-table-summary-wrapper',
        fixed && 'virtual-table-summary-sticky-bottom virtual-table-summary-top-border',
      )}
      style={{ paddingBottom: scrollbarHeight }}
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
