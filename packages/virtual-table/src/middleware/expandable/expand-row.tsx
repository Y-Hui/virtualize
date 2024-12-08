import './style.scss'

import clsx from 'classnames'
import { type CSSProperties, type FC, type ReactNode, useRef } from 'react'

import { useTableShared } from '../../core'

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
          // 关闭后，不需要再次更新 RowHeight，否则计算会出错
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
