import { createContext, useContext } from 'react'

export interface ContainerSizeState {
  scrollContainerWidth: number
  scrollContainerHeight: number
  tableWidth: number
  tableHeight: number
}

export const ContainerSize = createContext<ContainerSizeState | null>(null)

export function useContainerSize() {
  const context = useContext(ContainerSize)
  if (context == null) {
    throw new Error('useContainerSize provider not found')
  }
  return context
}
