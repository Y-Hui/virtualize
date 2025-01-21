import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import type { ScrollBarProps } from './scroll-bar'
import { createMiddleware } from '@are-visual/virtual-table'
import ScrollBar from './scroll-bar'

export type HorizontalScrollBarOptions = ScrollBarProps

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useHorizontalScrollBar<T = any>(
  ctx: MiddlewareContext<T>,
  options?: HorizontalScrollBarOptions,
): MiddlewareResult<T> {
  const { bodyRef } = ctx

  return {
    ...ctx,
    renderContent(children) {
      return (
        <>
          {children}
          <ScrollBar bodyRef={bodyRef} {...options} />
        </>
      )
    },
  }
}

export const horizontalScrollBar = createMiddleware(useHorizontalScrollBar)
