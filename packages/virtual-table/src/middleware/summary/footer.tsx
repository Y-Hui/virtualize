import clsx from 'clsx'
import type { FC, Key, ReactNode } from 'react'

import { type ColumnType } from '../../types'

export interface FooterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnType<any>[]
  fixed?: boolean
  children?: ReactNode
}

const Footer: FC<FooterProps> = (props) => {
  const { columns, fixed, children } = props

  return (
    <table
      className={clsx(
        'virtual-table-summary',
        fixed && 'virtual-table-summary-sticky-bottom',
      )}
    >
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
  )
}

export default Footer
