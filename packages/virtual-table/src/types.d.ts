/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyObject = Record<string, any>

// /** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends string> = T | (string & {})

export type {
  Middleware,
  MiddlewareContext,
  MiddlewareRender,
  MiddlewareRenders,
  MiddlewareResult,
} from './core/pipeline/useTablePipeline'
export type {
  AlignType,
  ColumnExtra,
  ColumnType,
  FixedType,
  PipelineRender,
  SizeType,
} from './core/types'
