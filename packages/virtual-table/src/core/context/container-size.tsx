import type { PropsWithChildren } from 'react'
import type { CalcSizeOptions } from '../hooks/useCalcSize'
import { createContext, useContext, useMemo } from 'react'
import { useCalcSize } from '../hooks/useCalcSize'

export interface ContainerSizeState {
  scrollContainerWidth: number
  scrollContainerHeight: number
  tableWidth: number
  tableHeight: number
}

const ContainerSize = createContext<ContainerSizeState | null>(null)

export function ContainerSizeContext(props: PropsWithChildren<CalcSizeOptions>) {
  const { getScroller, root, children } = props

  const {
    scrollContainerHeight,
    scrollContainerWidth,
    tableHeight,
    tableWidth,
  } = useCalcSize({ getScroller, root })

  const state = useMemo((): ContainerSizeState => {
    return {
      scrollContainerWidth,
      scrollContainerHeight,
      tableWidth,
      tableHeight,
    }
  }, [scrollContainerWidth, scrollContainerHeight, tableWidth, tableHeight])

  return (
    <ContainerSize.Provider value={state}>
      {children}
    </ContainerSize.Provider>
  )
}

export function useContainerSize() {
  const context = useContext(ContainerSize)
  if (context == null) {
    throw new Error('useContainerSize provider not found')
  }
  return context
}
