import type { ColumnType } from '@are-visual/virtual-table'
import type { FC, Key, ReactNode } from 'react'
import { useHorizontalScrollContext } from '@are-visual/virtual-table'
import { getScrollbarSize } from '@are-visual/virtual-table/middleware/utils/getScrollbarSize'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export interface FooterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnType<any>[]
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
        <colgroup>
          {columns.map((item, index) => {
            const key = 'key' in item ? (item.key as Key) : item.dataIndex
            return (
              <col
                key={typeof key === 'symbol' ? index : key}
                style={{
                  width: item.width,
                  minWidth: item.minWidth,
                }}
              />
            )
          })}
        </colgroup>
        <tfoot className="virtual-table-summary-tfoot">{children}</tfoot>
      </table>
    </div>
  )
}

export default Footer
