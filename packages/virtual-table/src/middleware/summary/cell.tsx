import clsx from 'classnames'
import { type DetailedHTMLProps, type HTMLAttributes, memo, useMemo } from 'react'

import {
  isValidFixed,
  isValidFixedLeft,
  isValidFixedRight,
  useTableSticky,
} from '../../core'
import { type ColumnType } from '../../types'
import { findLastIndex } from '../../utils/find-last-index'

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

  const { left: lastFixedLeftColumnIndex, right: lastFixedRightColumnIndex } =
    useMemo(() => {
      const left = findLastIndex(columnsFixed, (x) => isValidFixedLeft(x))
      const right = columnsFixed.findIndex((x) => isValidFixedRight(x))
      return { left, right }
    }, [columnsFixed])

  if (colSpan === 0) {
    return null
  }

  const index = columnIndex + ((colSpan ?? 0) - 1)

  return (
    <td
      {...restProps}
      colSpan={colSpan}
      className={clsx(
        'virtual-table-cell virtual-table-summary-cell',
        align != null && `virtual-table-align-${align}`,
        isValidFixed(fixed) && 'virtual-table-sticky-cell',
        lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
        lastFixedRightColumnIndex === index && 'virtual-table-cell-fix-right-last',
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
