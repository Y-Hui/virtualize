import clsx from 'classnames'
import { type DetailedHTMLProps, type HTMLAttributes, memo } from 'react'

import {
  isValidFixed,
  isValidFixedLeft,
  isValidFixedRight,
  useTableSticky,
} from '../../core'
import { type ColumnType } from '../../types'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>

export interface CellProps extends NativeProps, Pick<ColumnType<unknown>, 'align'> {
  index: number
  colSpan?: number
}

function Cell(props: CellProps) {
  const {
    className,
    style,
    children,
    align,
    colSpan,
    index: columnIndex,
    ...restProps
  } = props

  const { size: stickySizes, fixed: columnsFixed } = useTableSticky()
  const fixed = columnsFixed[columnIndex]

  if (colSpan === 0) {
    return null
  }

  return (
    <td
      {...restProps}
      colSpan={colSpan}
      className={clsx(
        'virtual-table-cell virtual-table-summary-cell',
        align != null && `virtual-table-align-${align}`,
        isValidFixed(fixed) && 'virtual-table-sticky-cell',
        className,
      )}
      style={{
        ...style,
        left: isValidFixedLeft(fixed) ? stickySizes[columnIndex] : undefined,
        right: isValidFixedRight(fixed) ? stickySizes[columnIndex] : undefined,
      }}
    >
      {children}
    </td>
  )
}

export default memo(Cell)
