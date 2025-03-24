import type { ColumnType } from '@are-visual/virtual-table'
import type { ReactElement } from 'react'
import { getKey, isValidFixed, isValidFixedLeft, isValidFixedRight, useTableSticky } from '@are-visual/virtual-table'
import clsx from 'clsx'
import { memo } from 'react'

export interface CellProps<T> {
  className?: string
  column: ColumnType<T>
}

function LoadingCell<T>(props: CellProps<T>) {
  const { column, className } = props

  const { align, fixed } = column
  const key = getKey(column)
  const { size: stickySizes } = useTableSticky()

  return (
    <td
      className={clsx(
        'virtual-table-cell',
        className,
        align != null && `virtual-table-align-${align}`,
        isValidFixed(fixed) && 'virtual-table-sticky-cell',
      )}
      style={{
        left: isValidFixedLeft(fixed) ? stickySizes.get(key) : undefined,
        right: isValidFixedRight(fixed) ? stickySizes.get(key) : undefined,
      }}
    >
      <div className="virtual-table-loading-skeleton" />
    </td>
  )
}

export default memo(LoadingCell) as <T>(props: CellProps<T>) => ReactElement
