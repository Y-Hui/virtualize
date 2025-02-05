import type { Key } from 'react'
import { createContext, useContext } from 'react'

export interface TableColumnsContextType {
  widthList: Map<Key, number>
  setWidthList: (value: Map<Key, number>) => void
}

export const ColumnSizes = createContext<TableColumnsContextType | null>(null)

if (__DEV__) {
  ColumnSizes.displayName = 'VirtualTable.ColumnSizes'
}

export function useColumnSizes() {
  const context = useContext(ColumnSizes)
  if (context == null) {
    throw new Error('useColumnSizes provider not found')
  }
  return context
}
