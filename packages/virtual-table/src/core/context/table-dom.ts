import { createContext, useContext } from 'react'

import { __DEV__ } from '../../utils/dev'
import { type ScrollElement } from '../../utils/dom'

export interface TableDOMContextType {
  scrollContainer: () => ScrollElement
  table: () => HTMLElement | null
  header: () => HTMLElement | null
  body: () => HTMLElement | null
}

export const TableDOM = createContext<TableDOMContextType | null>(null)

if (__DEV__) {
  TableDOM.displayName = 'VirtualTable.DOM'
}

export function useTableDOM() {
  const context = useContext(TableDOM)
  if (context == null) {
    throw Error('useTableDOM 脱离上下文调用')
  }
  return context
}
