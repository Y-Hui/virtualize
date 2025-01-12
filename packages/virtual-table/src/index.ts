export type {
  AlignType,
  AnyObject,
  ColumnExtra,
  ColumnType,
  ContainerSizeState,
  FixedType,
  HorizontalScrollContextState,
  Middleware,
  MiddlewareContext,
  MiddlewareRender,
  MiddlewareResult,
  OnRowType,
  PipelineRender,
  PipelineRenderOptions,
  SizeType,
  StickyContextState,
  TableColumnsContextType,
  TablePipeline,
  TableSharedContextType,
  UseTablePipelineOptions,
  VirtualTableCellProps,
  VirtualTableProps,
  VirtualTableRef,
  VirtualTableRowProps,
} from './core'
export {
  Colgroup,
  createMiddleware,
  isValidFixed,
  isValidFixedLeft,
  isValidFixedRight,
  useContainerSize,
  useHorizontalScrollContext,
  useShallowMemo,
  useTableColumns,
  useTablePipeline,
  useTableShared,
  useTableSticky,
  VirtualTable,
  VirtualTableCell,
  VirtualTableRow,
} from './core'

// const VirtualTable = Table as typeof Table & {
//   Summary: typeof Summary
// }

// VirtualTable.Summary = Summary
