import type { Key } from 'react'
import { createContext, useContext } from 'react'

export interface TableRowManagerContextType {
  getRowHeightList: () => number[]
  /**
   * @param rowKey
   * @param key 唯一的 key，用于去重
   * @param getHeight 行高
   */
  setRowHeightByRowKey: (rowKey: Key, key: Key, getHeight: () => number | undefined) => void
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
