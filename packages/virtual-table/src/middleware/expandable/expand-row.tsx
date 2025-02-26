import type { CSSProperties, FC, ReactNode } from 'react'
import { useContainerSize, useTableRowManager } from '@are-visual/virtual-table'
import clsx from 'clsx'

export interface ExpandRowProps {
  className?: string
  style?: CSSProperties
  rowIndex: number
  isExpanded?: boolean
  colSpan?: number
  children?: ReactNode
  fixed?: boolean
}

const ExpandRow: FC<ExpandRowProps> = (props) => {
  const {
    className,
    style,
    rowIndex,
    isExpanded,
    colSpan,
    children,
    fixed,
  } = props

  const { updateRowHeight } = useTableRowManager()
  const { tableWidth } = useContainerSize()

  return (
    <tr
      className={clsx('virtual-table-expanded-row', className)}
      style={{ ...style, display: isExpanded ? undefined : 'none' }}
      ref={(node) => {
        if (node == null) return
        updateRowHeight(rowIndex, `row(${rowIndex})-expandable`, node.offsetHeight)
      }}
    >
      <td colSpan={colSpan}>
        <div
          className={clsx(
            'virtual-table-cell',
            fixed && 'virtual-table-expanded-row-fixed',
          )}
          style={{ width: tableWidth <= 0 ? undefined : tableWidth }}
        >
          {children}
        </div>
      </td>
    </tr>
  )
}

export default ExpandRow
