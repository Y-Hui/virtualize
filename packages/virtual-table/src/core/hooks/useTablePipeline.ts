import { type ReactNode, useMemo } from 'react'

import { type NecessaryProps } from '../internal'
import { type PipelineRender } from '../types'

export interface MiddlewareContext<T> extends NecessaryProps<T> {
  rowClassName?: (record: T, index: number) => string
}

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

export interface MiddlewareResult<T> extends MiddlewareContext<T>, MiddlewareRenders {}

export type Middleware<T> = (context: MiddlewareContext<T>) => MiddlewareResult<T>

export class TablePipeline<T> {
  hooks: Middleware<T>[] = []

  // eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
  use(options: MiddlewareContext<T>): MiddlewareResult<T> {
    const context: { current: MiddlewareResult<T> } = { current: options }

    const renderFunctionMap: Record<keyof MiddlewareRenders, MiddlewareRender[]> = {
      render: [],
      renderBody: [],
      renderRow: [],
      renderCell: [],
      renderHeader: [],
      renderHeaderCell: [],
    } as const

    this.hooks.forEach((hook) => {
      const {
        render,
        renderBody,
        renderRow,
        renderCell,
        renderHeader,
        renderHeaderCell,
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
      context.current = rest
    })

    Object.entries(renderFunctionMap).forEach(([key, renders]) => {
      if (renders.length > 0) {
        context.current[key as keyof MiddlewareRenders] = (children) => {
          // reduce 把 [render1, render2] 转为 render1(render2(children))
          return renders.reduce<ReactNode>((node, render) => {
            return render(node)
          }, children)
        }
      }
    })

    return context.current
  }

  static defaultPipeline = new TablePipeline()
}

export interface UseTablePipelineOptions<T> {
  pipeline?: TablePipeline<T>
  use?: (Middleware<T> | undefined | null)[]
}

export function useTablePipeline<T>(
  options: UseTablePipelineOptions<T>,
): TablePipeline<T> {
  const { use } = options
  const pipeline = useMemo(() => new TablePipeline<T>(), [])
  if (use != null) {
    pipeline.hooks = use.filter((x) => x != null).concat(options.pipeline?.hooks ?? [])
  }
  return pipeline
}
