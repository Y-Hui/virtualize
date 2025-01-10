/* eslint-disable @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks */
import { createMiddleware } from '../../core/pipeline/create'
import { type MiddlewareContext } from '../../types'
import ScrollBar from './scroll-bar'

export const horizontalScrollBar = createMiddleware(function useHorizontalScrollBar<T>(
  ctx: MiddlewareContext<T>,
) {
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
})
