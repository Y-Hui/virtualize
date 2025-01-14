/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hook } from './table-pipeline'
import type { Middleware } from './types'
import { useMemo } from 'react'
import { shallowEqualArrays } from '../../utils/equal'
import { shakeUnsafeHooks, TablePipeline } from './table-pipeline'

export interface UseTablePipelineOptions<T = any> {
  pipeline?: TablePipeline<T>
  use?: (Middleware<T> | Hook<T>)[]
}

export { TablePipeline }
export type { Hook }

export function useTablePipeline<T = any>(options: UseTablePipelineOptions<T>) {
  const { use, pipeline: extraPipeline } = options

  const cached = useMemo(() => ({ current: new TablePipeline<T>() }), [])

  if (use != null) {
    const nextHooks = shakeUnsafeHooks([...use, ...(extraPipeline?.hooks ?? [])])

    if (!shallowEqualArrays(cached.current.hooks, nextHooks)) {
      const pipeline = new TablePipeline<T>()
      pipeline.setHooks(nextHooks)
      cached.current = pipeline
      return pipeline
    }
  }

  return cached.current
}
