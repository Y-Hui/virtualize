import { createContext, useContext } from 'react'

export interface TableRowManagerContextType {
  getRowHeightList: () => number[]
  updateRowHeight: (index: number, height: number) => void
}

export const TableRowManager = createContext<TableRowManagerContextType | null>(null)

if (__DEV__) {
  TableRowManager.displayName = 'VirtualTable.RowManager'
}

export function useTableRowManager() {
  const context = useContext(TableRowManager)
  if (context == null) {
    throw new Error('useTableRowManager provider not found')
  }
  return context
}
