import { createContext, useContext } from 'react'

import { __DEV__ } from '../../utils/dev'

export interface TableSharedContextType {
  getRowHeightList: () => number[]
  updateRowHeight: (index: number, height: number) => void
}

export const TableShared = createContext<TableSharedContextType | null>(null)

if (__DEV__) {
  TableShared.displayName = 'VirtualTable.Shared'
}

export function useTableShared() {
  const context = useContext(TableShared)
  if (context == null) {
    throw Error('useTableShared 脱离上下文调用')
  }
  return context
}
