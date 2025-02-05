import type { Key, PropsWithChildren } from 'react'
import type { ColumnType, FixedType } from '../types'
import { createContext, useContext, useMemo } from 'react'
import { useShallowMemo } from '../hooks/useShallowMemo'
import { getKey } from '../utils/get-key'
import { isValidFixedLeft, isValidFixedRight } from '../utils/verification'
import { useColumnSizes } from './column-sizes'

export interface StickyContextState {
  /** 每一列的宽度 */
  size: Map<Key, number>
  /** 每一列设置的 fixed 值 */
  fixed: { key: Key, fixed: FixedType | undefined }[]
}

export const Sticky = createContext<StickyContextState | null>(null)

if (__DEV__) {
  Sticky.displayName = 'VirtualTable.Sticky'
}

export function StickyContext(
  props: PropsWithChildren<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnType<any>[]
  }>,
) {
  const { columns, children } = props
  const { widthList } = useColumnSizes()

  const columnsFixedRecord = useMemo(() => {
    return columns.map((column) => {
      const key = getKey(column)
      return { key, fixed: column.fixed }
    })
  }, [columns])

  const stickySizes = useMemo(() => {
    let left = 0
    const leftOffset = columnsFixedRecord.reduce<number[]>((res, item, index) => {
      const { fixed, key } = item
      if (isValidFixedLeft(fixed)) {
        res[index] = left
        // eslint-disable-next-line react-compiler/react-compiler
        left += widthList.get(key) ?? 0
      }
      return res
    }, [])

    let right = 0
    const rightOffset = columnsFixedRecord.reduceRight((res, item, index) => {
      const { fixed, key } = item
      if (isValidFixedRight(fixed)) {
        res[index] = right
        right += widthList.get(key) ?? 0
      }
      return res
    }, [] as number[])

    return columnsFixedRecord.reduce((result, item, index) => {
      const { key, fixed } = item
      if (isValidFixedLeft(fixed)) {
        result.set(key, leftOffset[index])
        return result
      }
      if (isValidFixedRight(fixed)) {
        result.set(key, rightOffset[index])
        return result
      }
      return result
    }, new Map<Key, number>())
  }, [columnsFixedRecord, widthList])

  const shallowMemoFixedRecord = useShallowMemo(() => columnsFixedRecord)
  const shallowMemoStickySizes = useShallowMemo(() => stickySizes)

  const stickyState = useMemo((): StickyContextState => {
    return { size: shallowMemoStickySizes, fixed: shallowMemoFixedRecord }
  }, [shallowMemoFixedRecord, shallowMemoStickySizes])

  return (
    <Sticky.Provider value={stickyState}>
      {children}
    </Sticky.Provider>
  )
}

export function useTableSticky() {
  const context = useContext(Sticky)
  if (context == null) {
    throw new Error('useTableSticky provider not found')
  }
  return context
}
