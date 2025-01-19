import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import { createMiddleware } from '@are-visual/virtual-table'
import ScrollBar from './scroll-bar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useHorizontalScrollBar<T = any>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
  return {
    ...ctx,
    renderContent(children) {
      return (
        <>
          {children}
          <ScrollBar />
        </>
      )
    },
  }
}

export const horizontalScrollBar = createMiddleware(useHorizontalScrollBar)
