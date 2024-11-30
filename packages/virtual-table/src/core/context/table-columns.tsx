import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

import { type ColumnType } from '../../types'
import { __DEV__ } from '../../utils/dev'
import { shallowEqualArrays } from '../../utils/equal'
import { useCherryPickMemo } from '../hooks/useCherryPickMemo'

export interface TableColumnsContextType {
  widthList: number[]
  setWidthList: (value: number[]) => void
  stickySizes: number[]
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

  const columnsFixedRecord = useCherryPickMemo(() => {
    return columns.map((x) => x.fixed)
  })

  const stickySizes = useMemo(() => {
    let left = 0
    const leftOffset = columnsFixedRecord.reduce((res, fixed, index) => {
      if (fixed === 'left') {
        res[index] = left
        left += widthList[index] ?? 0
      }
      return res
    }, [] as number[])

    let right = 0
    const rightOffset = columnsFixedRecord.reduceRight((res, fixed, index) => {
      if (fixed === 'right') {
        res[index] = right
        right += widthList[index] ?? 0
      }
      return res
    }, [] as number[])

    return columnsFixedRecord.map((fixed, index) => {
      if (fixed === 'left') {
        return leftOffset[index]
      }
      if (fixed === 'right') {
        return rightOffset[index]
      }
      return 0
    })
  }, [widthList, columnsFixedRecord])

  const context = useMemo(() => {
    return {
      widthList,
      setWidthList: updateWidthList, // updateWidthList 函数没有使用任何 state，可以在 deps 中忽略（这是安全的）
      stickySizes,
    } satisfies TableColumnsContextType
  }, [widthList, stickySizes])

  return <TableColumns.Provider value={context}>{children}</TableColumns.Provider>
}

export function useTableColumns() {
  const context = useContext(TableColumns)
  if (context == null) {
    throw Error('useTableColumns 脱离上下文调用')
  }
  return context
}
