import { createContext, useContext } from 'react'

export interface ContainerSizeState {
  width: number
  height: number
}

export const ContainerSize = createContext<ContainerSizeState | null>(null)

export function useContainerSize() {
  const context = useContext(ContainerSize)
  if (context == null) {
    throw Error('useContainerSize 脱离上下文调用')
  }
  return context
}
