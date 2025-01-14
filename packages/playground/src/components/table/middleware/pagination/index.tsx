import './style.scss'

import type { MiddlewareContext, MiddlewareResult } from 'virtual-table'
import type { TablePaginationConfig } from './types'
import { createMiddleware } from 'virtual-table'
import Pagination from './pagination'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function usePagination<T = any>(ctx: MiddlewareContext<T>, options?: false | TablePaginationConfig): MiddlewareResult<T> {
  if (options === false) {
    return ctx
  }

  const { position = ['bottomRight'], ...rest } = options ?? {}
  const place = position[0]

  if (place === 'none') {
    return ctx
  }

  return {
    ...ctx,
    render(children) {
      const paginationNode = <Pagination {...rest} key="__pagination__" />

      if (place.includes('top')) {
        return (
          <>
            {paginationNode}
            {children}
          </>
        )
      }
      return (
        <>
          {children}
          {paginationNode}
        </>
      )
    },
  }
}

export const tablePagination = createMiddleware(usePagination)
export type { TablePaginationConfig }
