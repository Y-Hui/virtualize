import type { FC, ReactNode } from 'react'
import { useContainerSize } from '@are-visual/virtual-table'

export interface EmptyRowProps {
  colSpan: number
  children: ReactNode
}

const EmptyRow: FC<EmptyRowProps> = (props) => {
  const { colSpan, children } = props
  const { tableWidth } = useContainerSize()

  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0 }}>
        <div
          style={{
            boxSizing: 'border-box',
            position: 'sticky',
            left: 0,
            top: 0,
            padding: 16,
            width: tableWidth <= 0 ? undefined : tableWidth,
          }}
        >
          {children}
        </div>
      </td>
    </tr>
  )
}

export default EmptyRow
