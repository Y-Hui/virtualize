import { useMemo } from 'react'

import { type ColumnType, type NecessaryProps } from '../../types'

export type MiddlewareResult<T> = {
  rowClassName?: (record: T, index: number) => string
  onUpdateColumns?: (columns: ColumnType<T>[]) => ColumnType<T>[]
}

export interface MiddlewareContext<T> extends NecessaryProps<T> {
  rowClassName?: (record: T, index: number) => string
}
export type Middleware<T> = (context: MiddlewareContext<T>) => MiddlewareResult<T> | void

export class TablePipeline<T> {
  hooks: Middleware<T>[] = []

  // eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
  use(options: MiddlewareContext<T>): MiddlewareContext<T> {
    const actions: MiddlewareResult<T>[] = []
    const pipeResult = options

    this.hooks.forEach((hook) => {
      const action = hook(pipeResult)
      if (action != null) {
        actions.push(action)
      }
    })

    actions.forEach((action) => {
      pipeResult.columns =
        action.onUpdateColumns?.(pipeResult.columns) ?? pipeResult.columns
    })

    if (actions.some((x) => x.rowClassName != null)) {
      pipeResult.rowClassName = (record, index) => {
        return actions.reduce((result, action) => {
          if (action.rowClassName == null) {
            return result
          }
          return result + action.rowClassName(record, index)
        }, '')
      }
    }

    return pipeResult
  }

  static defaultPipeline = new TablePipeline()
}

export interface UseTablePipelineOptions<T> {
  use?: (Middleware<T> | undefined | null)[]
}

export function useTablePipeline<T>(
  options: UseTablePipelineOptions<T>,
): TablePipeline<T> {
  const { use } = options
  const pipeline = useMemo(() => new TablePipeline<T>(), [])
  if (use != null) {
    pipeline.hooks = use.filter((x) => x != null)
  }
  return pipeline
}
