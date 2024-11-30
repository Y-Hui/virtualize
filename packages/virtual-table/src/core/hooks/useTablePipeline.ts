import { useMemo } from 'react'

import { type NecessaryProps } from '../../types'

export interface MiddlewareContext<T> extends NecessaryProps<T> {
  rowClassName?: (record: T, index: number) => string
}
export type Middleware<T> = (context: MiddlewareContext<T>) => MiddlewareContext<T>

export class TablePipeline<T> {
  hooks: Middleware<T>[] = []

  // eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
  use(options: MiddlewareContext<T>): MiddlewareContext<T> {
    const context = { current: options }

    this.hooks.forEach((hook) => {
      context.current = hook(context.current)
    })

    return context.current
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
