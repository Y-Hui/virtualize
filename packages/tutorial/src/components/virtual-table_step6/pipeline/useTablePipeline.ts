import type { ReactNode } from 'react'
import type { Middleware, MiddlewareContext, MiddlewareRenders, MiddlewareResult, OnRowType } from './types'
import clsx from 'clsx'

type RenderFunctions<T> = {
  [K in keyof T]: (T[K])[]
}

export class TablePipeline<T> {
  constructor(hooks: Middleware<T>[]) {
    this.use = this.use.bind(this)
    this.setHooks(hooks)
  }

  hooks: Middleware<T>[] = []

  setHooks(value: Middleware<T>[]) {
    this.hooks = value
  }

  use(options: MiddlewareContext<T>): MiddlewareResult<T> {
    if (this.hooks.length === 0) {
      return options
    }
    const context: { current: MiddlewareResult<T> } = { current: options }
    const renderFunctionMap: RenderFunctions<Required<MiddlewareRenders>> = {
      render: [],
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
    }
    const rowClassNameFunctions: ((record: T, index: number) => string)[] = []
    const onRowFunctions: OnRowType<T>[] = []
    const hooks = this.hooks.slice()

    hooks.forEach((hook) => {
      const nextCtx = hook(context.current)
      const {
        render: _render,
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
          // @ts-expect-error: There is no way to declare the type correctly, but it works at runtime.
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
            // @ts-expect-error: There is no way to declare the type correctly, but it works at runtime.
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

  static defaultInstance = new TablePipeline<any>([])
}

interface UseTablePipelineOptions<T> {
  use: Middleware<T>[]
}

export function useTablePipeline<T>(options: UseTablePipelineOptions<T>) {
  const { use: hooks } = options
  return new TablePipeline(hooks)
}
