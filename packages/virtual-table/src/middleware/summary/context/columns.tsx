import type { ColumnDescriptor } from '@are-visual/virtual-table'
import { createContext } from 'react'

export const SummaryContext = createContext<ColumnDescriptor[] | null>(null)
