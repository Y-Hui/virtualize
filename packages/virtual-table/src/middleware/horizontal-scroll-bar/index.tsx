import type { MiddlewareContext, MiddlewareResult } from '../../core'
import { createMiddleware } from '../../core'
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
