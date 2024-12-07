/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'classnames'
import { type ReactNode, useRef } from 'react'

import { shallowEqualArrays } from '../../utils/equal'
import { type NecessaryProps } from '../internal'
import { type OnRowType, type PipelineRender } from '../types'

export interface MiddlewareContext<T> extends NecessaryProps<T> {}

export type MiddlewareRender = PipelineRender

export interface MiddlewareRenders {
  /**
   * 自定义 Table 渲染，children 为 table。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  render?: MiddlewareRender
  /**
   * 自定义 Table 渲染，children 为 TableBody。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBody?: MiddlewareRender
  /**
   * 自定义 Row 渲染，children 为 Row。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderRow?: MiddlewareRender
  /**
   * 自定义 Row 渲染，children 为 Cell。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderCell?: MiddlewareRender
  /**
   * 自定义 TableHeader 渲染，children 为 TableHeader。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeader?: MiddlewareRender
  /**
   * 自定义 Row 渲染，children 为 HeaderCell。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderCell?: MiddlewareRender
}

export interface MiddlewareResult<T> extends MiddlewareContext<T>, MiddlewareRenders {
  rowClassName?: (record: T, index: number) => string
  onRow?: OnRowType
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
      renderBody: [],
      renderRow: [],
      renderCell: [],
      renderHeader: [],
      renderHeaderCell: [],
    } as const

    const rowClassNameFunctions: ((record: T, index: number) => string)[] = []
    const onRowFunctions: OnRowType[] = []

    this.hooks.forEach((hook) => {
      const {
        render,
        renderBody,
        renderRow,
        renderCell,
        renderHeader,
        renderHeaderCell,
        rowClassName,
        onRow,
        ...rest
      } = hook(context.current)

      if (typeof render === 'function') {
        renderFunctionMap.render.push(render)
      }
      if (typeof renderBody === 'function') {
        renderFunctionMap.renderBody.push(renderBody)
      }
      if (typeof renderRow === 'function') {
        renderFunctionMap.renderRow.push(renderRow)
      }
      if (typeof renderCell === 'function') {
        renderFunctionMap.renderCell.push(renderCell)
      }
      if (typeof renderHeader === 'function') {
        renderFunctionMap.renderHeader.push(renderHeader)
      }
      if (typeof renderHeaderCell === 'function') {
        renderFunctionMap.renderHeaderCell.push(renderHeaderCell)
      }
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
