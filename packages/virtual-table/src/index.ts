import VirtualTable from './table'

export type {
  Middleware,
  TablePipeline,
  UseTablePipelineOptions,
} from './core/hooks/useTablePipeline'
export { useTablePipeline } from './core/hooks/useTablePipeline'
export type * from './types'

export default VirtualTable
