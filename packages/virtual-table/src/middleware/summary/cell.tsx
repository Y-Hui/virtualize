import type { ColumnType } from '@are-visual/virtual-table'
import type { DetailedHTMLProps, HTMLAttributes, Key } from 'react'
import { isValidFixed, isValidFixedLeft, isValidFixedRight, useTableSticky } from '@are-visual/virtual-table'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

type NativeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>

export interface CellProps extends NativeProps, Pick<ColumnType<unknown>, 'align'> {
  // index: number
  columnKey: Key
  colSpan?: number
}

function Cell(props: CellProps) {
  const {
    className,
    style,
    children,
    align,
    colSpan,
    columnKey,
    ...restProps
  } = props

  const { size: stickySizes, fixed: columnsFixed } = useTableSticky()

  const stickySize = stickySizes.get(columnKey)
  const fixed = columnsFixed.find((x) => x.key === columnKey)?.fixed

  const { left: lastFixedLeftColumnKey, right: firstFixedRightColumnKey } = useMemo(() => {
    const left = columnsFixed.reduce<Key | undefined>((result, x) => {
      if (isValidFixedLeft(x.fixed)) {
        return x.key
      }
      return result
    }, undefined)
    const right = columnsFixed.find((x) => isValidFixedRight(x.fixed))?.key
    return { left, right }
  }, [columnsFixed])

  if (colSpan === 0) {
    return null
  }

  // const colOffset = Math.max(0, (colSpan ?? 0) - 1)
  // let index = columnIndex + colOffset
  // let offset = stickySizes[index]

  if (colSpan != null) {
    // if (index === lastFixedLeftColumnIndex) {
    //   index = columnIndex + colOffset
    // } else if (columnIndex === firstFixedRightColumnIndex) {
    //   index = columnIndex
    //   offset = stickySizes[index + colOffset]
    // }
  }

  return (
    <td
      {...restProps}
      colSpan={colSpan}
      className={clsx(
        'virtual-table-cell virtual-table-summary-cell',
        align != null && `virtual-table-align-${align}`,
        isValidFixed(fixed) && 'virtual-table-sticky-cell',
        lastFixedLeftColumnKey === columnKey && 'virtual-table-cell-fix-left-last',
        firstFixedRightColumnKey === columnKey && 'virtual-table-cell-fix-right-first',
        className,
      )}
      style={{
        ...style,
        left: isValidFixedLeft(fixed) ? stickySize : undefined,
        right: isValidFixedRight(fixed) ? stickySize : undefined,
      }}
    >
      {children}
    </td>
  )
}

export default memo(Cell)
