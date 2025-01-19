import type { FixedType } from '../types'
import { createContext, useContext } from 'react'

export interface StickyContextState {
  /** 每一列的宽度 */
  size: number[]
  /** 每一列设置的 fixed 值 */
  fixed: (FixedType | undefined)[]
}

export const Sticky = createContext<StickyContextState | null>(null)

if (__DEV__) {
  Sticky.displayName = 'VirtualTable.Sticky'
}

export function useTableSticky() {
  const context = useContext(Sticky)
  if (context == null) {
    throw new Error('useTableSticky 脱离上下文调用')
  }
  return context
}
