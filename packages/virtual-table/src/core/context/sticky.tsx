import { createContext, useContext } from 'react'

import { __DEV__ } from '../../utils/dev'

export const StickySize = createContext<number[] | null>(null)

if (__DEV__) {
  StickySize.displayName = 'VirtualTable.StickySize'
}

export function useStickySize() {
  const context = useContext(StickySize)
  if (context == null) {
    throw Error('useStickySize 脱离上下文调用')
  }
  return context
}
