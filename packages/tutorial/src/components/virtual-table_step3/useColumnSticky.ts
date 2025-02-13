import type { CSSProperties, Key } from 'react'
import type { ColumnType } from './types'
import clsx from 'clsx'
import { useMemo } from 'react'
import { getKey } from './utils/get-key'

interface UseColumnStickyArgs {
  columns: ColumnType<any>[]
  columnSizes: Map<Key, number>
}

export function useColumnSticky(args: UseColumnStickyArgs) {
  const { columns, columnSizes } = args

  const stickySizes = useMemo(() => {
    const result = new Map<Key, number>()
    columns.reduce((left, column) => {
      if (column.fixed != null && ['left', 'right'].includes(column.fixed)) {
        const key = getKey(column)
        const size = columnSizes.get(key) ?? 0
        if (column.fixed === 'left') {
          result.set(key, left)
          return left + size
        }
      }
      return left
    }, 0)
    columns.reduceRight((right, column) => {
      if (column.fixed != null && ['left', 'right'].includes(column.fixed)) {
        const key = getKey(column)
        const size = columnSizes.get(key) ?? 0
        if (column.fixed === 'right') {
          result.set(key, right)
          return right + size
        }
      }
      return right
    }, 0)
    return result
  }, [columnSizes, columns])

  const lastFixedLeftColumnKey = columns.reduce<Key | undefined>((result, x) => {
    if (x.fixed === 'left') {
      return getKey(x)
    }
    return result
  }, undefined)
  const firstFixedRightColumn = columns.find((x) => x.fixed === 'right')
  const firstFixedRightColumnKey = firstFixedRightColumn == null ? undefined : getKey(firstFixedRightColumn)

  const calcFixedStyle = (column: ColumnType<any>): { className: string, style?: CSSProperties } => {
    if (column.fixed != null && ['left', 'right'].includes(column.fixed)) {
      const key = getKey(column)
      const isLeft = column.fixed === 'left'
      const isRight = column.fixed === 'right'
      return {
        className: clsx('virtual-table-sticky-cell', {
          'virtual-table-cell-fix-left-last': isLeft && lastFixedLeftColumnKey === key,
          'virtual-table-cell-fix-right-first': isRight && firstFixedRightColumnKey === key,
        }),
        style: {
          left: isLeft ? stickySizes.get(key) : undefined,
          right: isRight ? stickySizes.get(key) : undefined,
        },
      }
    }
    return {
      className: '',
    }
  }

  return calcFixedStyle
}
