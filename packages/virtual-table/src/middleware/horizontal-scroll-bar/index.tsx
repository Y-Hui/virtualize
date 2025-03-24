import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import type { ScrollBarProps } from './scroll-bar'
import { createMiddleware } from '@are-visual/virtual-table'
import ScrollBar from './scroll-bar'

export type HorizontalScrollBarOptions = Omit<ScrollBarProps, 'bodyRef'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useHorizontalScrollBar<T = any>(
  ctx: MiddlewareContext<T>,
  options?: HorizontalScrollBarOptions,
): MiddlewareResult<T> {
  const { bodyRootRef } = ctx

  return {
    ...ctx,
    renderContent(children) {
      return (
        <>
          {children}
          <ScrollBar
            bodyRef={bodyRootRef}
            {...options}
          />
        </>
      )
    },
  }
}

export const horizontalScrollBar = createMiddleware(useHorizontalScrollBar)
