/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'classnames'
import { type ReactNode, useRef } from 'react'

import { shallowEqualArrays } from '../../utils/equal'
import { type NecessaryProps } from '../internal'
import { type OnRowType, type PipelineRender } from '../types'

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

export class TablePipeline<T> {
  constructor() {
    this.use = this.use.bind(this)
  }

  hooks: Middleware<T>[] = []

  // eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
  use(options: MiddlewareContext<T>): MiddlewareResult<T> {
    if (this.hooks.length === 0) {
      return options
    }

    const context: { current: MiddlewareResult<T> } = { current: options }

    const renderFunctionMap: Record<keyof MiddlewareRenders, MiddlewareRender[]> = {
      render: [],
      renderRoot: [],
      renderContent: [],
      renderHeaderWrapper: [],
      renderHeaderRoot: [],
      renderHeader: [],
      renderHeaderRow: [],
      renderHeaderCell: [],
      renderBodyWrapper: [],
      renderBodyRoot: [],
      renderBody: [],
      renderRow: [],
      renderCell: [],
    } as const

    const rowClassNameFunctions: ((record: T, index: number) => string)[] = []
    const onRowFunctions: OnRowType<T>[] = []

    this.hooks.forEach((hook) => {
      const nextCtx = hook(context.current)
      const {
        render: _render,
        renderRoot: _renderRoot,
        renderContent: _renderContent,
        renderHeaderWrapper: _renderHeaderWrapper,
        renderHeaderRoot: _renderHeaderRoot,
        renderHeader: _renderHeader,
        renderHeaderRow: _renderHeaderRow,
        renderHeaderCell: _renderHeaderCell,
        renderBodyWrapper: _renderBodyWrapper,
        renderBodyRoot: _renderBodyRoot,
        renderBody: _renderBody,
        renderRow: _renderRow,
        renderCell: _renderCell,

        rowClassName,
        onRow,
        ...rest
      } = nextCtx

      Object.entries(renderFunctionMap).forEach(([key, value]) => {
        const target = nextCtx[key as keyof MiddlewareRenders]
        if (typeof target === 'function') {
          value.push(target)
        }
      })

      if (typeof rowClassName === 'function') {
        rowClassNameFunctions.push(rowClassName)
      }
      if (typeof onRow === 'function') {
        onRowFunctions.push(onRow)
      }
      context.current = rest
    })

    Object.entries(renderFunctionMap).forEach(([key, renders]) => {
      if (renders.length > 0) {
        context.current[key as keyof MiddlewareRenders] = (children, args) => {
          // reduce 把 [render1, render2] 转为 render1(render2(children))
          return renders.reduce<ReactNode>((node, render) => {
            return render(node, args)
          }, children)
        }
      }
    })

    if (rowClassNameFunctions.length > 0) {
      context.current.rowClassName = (record, index) => {
        return clsx(...rowClassNameFunctions.map((fn) => fn(record, index)))
      }
    }

    if (onRowFunctions.length > 0) {
      context.current.onRow = (record, index) => {
        return onRowFunctions.reduce((result, item) => {
          return { ...result, ...item(record, index) }
        }, {})
      }
    }

    return context.current
  }

  static defaultPipeline = new TablePipeline()
}

export interface UseTablePipelineOptions<T = any> {
  pipeline?: Middleware<T>
  use?: (Middleware<T> | undefined | null)[]
}

export function useTablePipeline<T = any>(options: UseTablePipelineOptions<T>) {
  const { use, pipeline: extraPipeline } = options

  const prevPipeline = useRef<TablePipeline<T> | null>(null)

  if (use != null) {
    const nextHooks = [...use, extraPipeline].filter((x) => x != null)

    // eslint-disable-next-line react-compiler/react-compiler
    if (!shallowEqualArrays(prevPipeline.current?.hooks, nextHooks)) {
      const pipeline = new TablePipeline<T>()
      pipeline.hooks = nextHooks.filter((x) => x != null)
      // eslint-disable-next-line react-compiler/react-compiler
      prevPipeline.current = pipeline
      return pipeline.use
    }
  }

  // eslint-disable-next-line react-compiler/react-compiler
  return prevPipeline.current?.use
}
