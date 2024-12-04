import { type ReactNode } from 'react'

import { type PipelineRender, type PipelineRenderOptions } from '../types'

function pipelineRender(
  node: ReactNode,
  render: PipelineRender | undefined,
  options: PipelineRenderOptions,
): ReactNode {
  if (typeof render === 'function') {
    return render(node, options)
  }
  return node
}

export { pipelineRender }
