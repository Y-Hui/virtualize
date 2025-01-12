/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'

import { shallowEqualArrays } from '../../utils/equal'
import { type NecessaryProps } from '../internal'
import { type OnRowType, type PipelineRender } from '../types'
import { type Hook, shakeUnsafeHooks, TablePipeline } from './table-pipeline'

export interface MiddlewareContext<T> extends NecessaryProps<T> {}

export type MiddlewareRender = PipelineRender

// Context
// └── render(<TableRoot />)
//     │
//     └── renderRoot(<TableRoot />) div.virtual-table
//         │
//         └── renderContent()
//             │
//             ├── renderHeaderWrapper(<TableHeader />) div.virtual-table-header
//             │   │
//             │   └── renderHeaderRoot(<table />)
//             │       ├── colgroup
//             │       │
//             │       └── renderHeader(<thead />)
//             │           └── renderHeaderRow(<tr />)
//             │               └── renderHeaderCell(<th />)
//             │
//             └── renderBodyWrapper(<TableBody />) div.virtual-table-body-wrapper
//                 │
//                 └── renderBodyRoot(table.virtual-table-body)
//                     ├── colgroup
//                     │
//                     └── renderBody(<tbody />)
//                         └── renderRow(<tr />)
//                             └── renderCell(<td />)
//
export interface MiddlewareRenders {
  /**
   * 自定义最外层渲染，children 为 整个 VirtualTable。
   */
  render?: MiddlewareRender
  /**
   * 自定义 TableRoot(div.virtual-table) 的渲染。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderRoot?: MiddlewareRender
  /**
   * 自定义渲染，children 为（TableHeader、TableBody）。
   */
  renderContent?: MiddlewareRender
  /**
   * 自定义渲染 TableHeader。children 为 div.virtual-table-header
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderWrapper?: MiddlewareRender
  /**
   * children 为 table
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderRoot?: MiddlewareRender
  /**
   * children 为 thead
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeader?: MiddlewareRender
  /**
   * children 为 tr
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderRow?: MiddlewareRender
  /**
   * children 为 th
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderCell?: MiddlewareRender
  /**
   * 自定义渲染 TableBody。children 为 div.virtual-table-body-wrapper
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBodyWrapper?: MiddlewareRender
  /**
   * children 为 table.virtual-table-body
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBodyRoot?: MiddlewareRender
  /**
   * children 为 tbody
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBody?: MiddlewareRender
  /**
   * children 为 tr
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderRow?: MiddlewareRender
  /**
   * children 为 td
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderCell?: MiddlewareRender
}

export interface MiddlewareResult<T> extends MiddlewareContext<T>, MiddlewareRenders {
  rowClassName?: (record: T, index: number) => string
  onRow?: OnRowType<T>
}

export type Middleware<T> = (context: MiddlewareContext<T>) => MiddlewareResult<T>

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
