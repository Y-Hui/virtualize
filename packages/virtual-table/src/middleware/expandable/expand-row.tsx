import './style.scss'

import clsx from 'classnames'
import { type CSSProperties, type FC, type ReactNode, useRef } from 'react'

import { useContainerSize, useTableShared } from '../../core'

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

  const { getRowHeightList, updateRowHeight } = useTableShared()
  const { tableWidth } = useContainerSize()

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
