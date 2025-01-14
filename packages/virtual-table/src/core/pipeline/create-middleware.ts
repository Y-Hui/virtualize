/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Middleware, MiddlewareContext, MiddlewareResult } from './types'
import { isShallowEqual } from '../../utils/equal'

/**
 * 创建中间件，内部会浅比较 options，只有 options 改变才会返回新的函数。
 */
function createMiddleware<T, Args extends any[]>(
  hook: (ctx: MiddlewareContext<T>, ...args: Args) => MiddlewareResult<T>,
): (...args: Args) => Middleware<T> {
  const cache = {
    current: null as Middleware<T> | null,
    options: null as Args | null | undefined,
  }

  return (...options: Args): Middleware<T> => {
    const useMiddleware: Middleware<T> = (ctx) => hook(ctx, ...options)

    if (isShallowEqual(options, cache.options)) {
      return cache.current ?? useMiddleware
    }

    cache.options = options
    cache.current = useMiddleware

    return useMiddleware
  }
}

export type { MiddlewareResult }
export { createMiddleware }
