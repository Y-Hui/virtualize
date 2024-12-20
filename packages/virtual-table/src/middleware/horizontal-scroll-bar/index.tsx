/* eslint-disable @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks */
import { type MiddlewareContext } from '../../types'
import { createMiddleware } from '../index'
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
