import { createMiddleware, type MiddlewareContext, type MiddlewareResult } from '../../core'
import ScrollBar from './scroll-bar'

// eslint-disable-next-line @eslint-react/hooks-extra/no-useless-custom-hooks, @typescript-eslint/no-explicit-any
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
