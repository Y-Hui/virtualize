import './style.scss'

import clsx from 'classnames'
import { type CSSProperties, type FC, type ReactNode, useRef } from 'react'

import { useTableShared } from '../../core/context/shared'

export interface ExpandRowProps {
  className?: string
  style?: CSSProperties
  rowIndex: number
  isExpanded?: boolean
  colSpan?: number
  children?: ReactNode
}

const ExpandRow: FC<ExpandRowProps> = (props) => {
  const { className, style, rowIndex, isExpanded, colSpan, children } = props

  const { getRowHeightList, updateRowHeight } = useTableShared()
  const currentNodeHeight = useRef(0)

  return (
    <tr
      className={clsx('virtual-table-expanded-row', className)}
      style={{ ...style, display: isExpanded ? undefined : 'none' }}
      ref={(node) => {
        if (node == null) return

        const originHeight = getRowHeightList()[rowIndex] ?? 0
        if (isExpanded) {
          currentNodeHeight.current = node.offsetHeight
          updateRowHeight(rowIndex, originHeight + currentNodeHeight.current)
        } else {
          updateRowHeight(rowIndex, originHeight - currentNodeHeight.current)
        }
      }}
    >
      <td className="virtual-table-cell" colSpan={colSpan}>
        {children}
      </td>
    </tr>
  )
}

export default ExpandRow
