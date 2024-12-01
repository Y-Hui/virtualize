import { type ReactNode } from 'react'

import { type PipelineRender } from '../types'

export function pipelineRender(node: ReactNode, render?: PipelineRender) {
  if (typeof render === 'function') {
    return render(node)
  }
  return node
}
