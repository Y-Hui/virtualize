import type { ReactNode } from 'react'
import type { MergedMiddlewareRender } from './types'

type RenderOptions<T> = T extends ((children: ReactNode, options: infer Opt) => ReactNode) ? Opt : object

export function pipelineRender<T extends MergedMiddlewareRender>(
  node: ReactNode,
  render: T | undefined,
  options: RenderOptions<T>,
): ReactNode {
  if (typeof render === 'function') {
    // @ts-expect-error: There is no way to declare the type correctly, but it works at runtime.
    return render(node, options)
  }
  return node
}
