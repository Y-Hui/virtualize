import type { ColumnType } from '@are-visual/virtual-table'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { findLastIndex, isValidFixed, isValidFixedLeft, isValidFixedRight, useTableSticky } from '@are-visual/virtual-table'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

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

  const { left: lastFixedLeftColumnIndex, right: firstFixedRightColumnIndex } = useMemo(() => {
    const left = findLastIndex(columnsFixed, (x) => isValidFixedLeft(x))
    const right = columnsFixed.findIndex((x) => isValidFixedRight(x))
    return { left, right }
  }, [columnsFixed])

  if (colSpan === 0) {
    return null
  }

  const colOffset = Math.max(0, (colSpan ?? 0) - 1)
  let index = columnIndex + colOffset
  let offset = stickySizes[index]

  if (colSpan != null) {
    if (index === lastFixedLeftColumnIndex) {
      index = columnIndex + colOffset
    } else if (columnIndex === firstFixedRightColumnIndex) {
      index = columnIndex
      offset = stickySizes[index + colOffset]
    }
  }

  return (
    <td
      {...restProps}
      colSpan={colSpan}
      className={clsx(
        'virtual-table-cell virtual-table-summary-cell',
        align != null && `virtual-table-align-${align}`,
        isValidFixed(fixed) && 'virtual-table-sticky-cell',
        lastFixedLeftColumnIndex === index && 'virtual-table-cell-fix-left-last',
        firstFixedRightColumnIndex === index && 'virtual-table-cell-fix-right-first',
        className,
      )}
      style={{
        ...style,
        left: isValidFixedLeft(fixed) ? stickySizes[columnIndex] : undefined,
        right: isValidFixedRight(fixed) ? offset : undefined,
      }}
    >
      {children}
    </td>
  )
}

export default memo(Cell)
