import { createContext, useContext } from 'react'

export interface ContainerSizeState {
  width: number
  height: number
  tableWidth: number
  tableHeight: number
  container: () => HTMLElement | null
}

export const ContainerSize = createContext<ContainerSizeState | null>(null)

export function useContainerSize() {
  const context = useContext(ContainerSize)
  if (context == null) {
    throw new Error('useContainerSize 脱离上下文调用')
  }
  return context
}
