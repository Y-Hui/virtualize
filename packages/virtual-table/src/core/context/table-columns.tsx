import type { PropsWithChildren } from 'react'
import type { ColumnType } from '../types'
import type { FixedType } from '../utils/verification'
import type { StickyContextState } from './sticky'
import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { shallowEqualArrays } from '../../utils/equal'
import { useShallowMemo } from '../hooks/useShallowMemo'
import { isValidFixedLeft, isValidFixedRight } from '../utils/verification'
import { Sticky } from './sticky'

export interface TableColumnsContextType {
  widthList: number[]
  setWidthList: (value: number[]) => void
}

export const TableColumns = createContext<TableColumnsContextType | null>(null)

if (__DEV__) {
  TableColumns.displayName = 'VirtualTable.Columns'
}

// 这个组件存在的意义只是为了隔离更新，context 更新时不影响其他组件，而只影响订阅 context 的组件。
export function TableColumnsContext(
  props: PropsWithChildren<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnType<any>[]
  }>,
) {
  const { columns, children } = props
  const [widthList, setWidthList] = useState<number[]>([])
  const widthListRef = useRef<number[]>([])

  const updateWidthList = (value: number[]) => {
    const snap = value.slice()
    if (!shallowEqualArrays(widthListRef.current, snap)) {
      widthListRef.current = snap
      setWidthList(snap)
    }
  }

  const columnsFixedRecord = useShallowMemo(() => {
    return columns.map((x): FixedType | undefined => x.fixed)
  })

  const stickySizes = useShallowMemo(() => {
    let left = 0
    const leftOffset = columnsFixedRecord.reduce<number[]>((res, fixed, index) => {
      if (isValidFixedLeft(fixed)) {
        res[index] = left
        left += widthList[index] ?? 0
      }
      return res
    }, [])

    let right = 0
    const rightOffset = columnsFixedRecord.reduceRight((res, fixed, index) => {
      if (isValidFixedRight(fixed)) {
        res[index] = right
        right += widthList[index] ?? 0
      }
      return res
    }, [] as number[])

    return columnsFixedRecord.map((fixed, index) => {
      if (isValidFixedLeft(fixed)) {
        return leftOffset[index]
      }
      if (isValidFixedRight(fixed)) {
        return rightOffset[index]
      }
      return 0
    })
  })

  const stickyState = useMemo((): StickyContextState => {
    return { size: stickySizes, fixed: columnsFixedRecord }
  }, [columnsFixedRecord, stickySizes])

  const context = useMemo<TableColumnsContextType>(() => {
    return {
      widthList,
      setWidthList: updateWidthList,
    }
  }, [widthList])

  return (
    <TableColumns.Provider value={context}>
      <Sticky.Provider value={stickyState}>{children}</Sticky.Provider>
    </TableColumns.Provider>
  )
}

export function useTableColumns() {
  const context = useContext(TableColumns)
  if (context == null) {
    throw new Error('useTableColumns provider not found')
  }
  return context
}
