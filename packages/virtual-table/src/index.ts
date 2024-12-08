import Summary from './middleware/summary/summary'
import Table from './table'

export type {
  Middleware,
  TablePipeline,
  UseTablePipelineOptions,
} from './core/hooks/useTablePipeline'
export { useTablePipeline } from './core/hooks/useTablePipeline'
export type { ExpandableConfig } from './middleware/expandable'
export type { TableRowSelection } from './middleware/selection/types'
export type * from './types'

const VirtualTable = Table as typeof Table & {
  Summary: typeof Summary
}

VirtualTable.Summary = Summary

export { Summary }
export default VirtualTable
