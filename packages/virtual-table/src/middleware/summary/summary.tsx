import type { ReactElement, ReactNode } from 'react'

import Cell from './cell'
import Outlet from './outlet'
import Row from './row'

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom'
  children?: ReactNode
}

function Summary({ children }: SummaryProps) {
  return children as ReactElement
}

Summary.Row = Row
Summary.Cell = Cell
Summary.Outlet = Outlet

export default Summary
