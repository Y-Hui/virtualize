import { type ReactNode } from 'react'

import type { MergedMiddlewareRender } from './types'

type RenderOptions<T> = T extends ((children: ReactNode, options: infer Opt) => ReactNode) ? Opt : object

export function pipelineRender<T extends MergedMiddlewareRender>(
  node: ReactNode,
  render: T | undefined,
  options: RenderOptions<T>,
): ReactNode {
  if (typeof render === 'function') {
    return render(node, options)
  }
  return node
}
