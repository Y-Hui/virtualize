import type { Key } from 'react'
import type { ColumnType } from '../types'
import { useMemo } from 'react'
import { getKey } from '../utils/get-key'
import { getColumnWidth } from '../utils/get-width'
import { useShallowMemo } from './useShallowMemo'

export function useCollectColumnWidth<T>(columns: ColumnType<T>[], defaultColumnWidth: number) {
  const widths = useMemo(() => {
    return columns.reduce((result, column) => {
      const width = getColumnWidth(column, defaultColumnWidth)
      result.set(getKey(column), width)
      return result
    }, new Map<Key, number>())
  }, [columns, defaultColumnWidth])

  return useShallowMemo(() => widths)
}
