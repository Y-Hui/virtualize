import { isShallowEqual } from '../../utils/equal'
import { type Middleware, type MiddlewareContext, type MiddlewareResult } from './useTablePipeline'

/* eslint-disable @typescript-eslint/no-explicit-any */
type MiddlewareWithOptions<T, P = undefined> = (
  ctx: MiddlewareContext<T>,
  options: P,
) => MiddlewareResult<T>

/**
 * 创建一个中间件
 *
 * ```tsx
 * // 创建不需要参数的中间件
 * const log = createMiddleware(function useLog(ctx) {
 *  // do something...
 *  return ctx
 * })
 *
 * log()
 *
 * // 参数类型声明加上 void，则中间件参数可选。
 * // 数据不声明类型，则为 any
 * const log = createMiddleware(function useLog(ctx, options: { prefix: string } | void) {
 *  // 未指定类型时，dataSource 为 any[]
 *  const { dataSource } = ctx
 *  console.log(`${options?.prefix}:log`)
 *  return ctx
 * })
 *
 * log()
 *
 * // 参数声明类型，参数必填
 * // 数据指定类型
 * const log = createMiddleware<UserInfo, { prefix: string }>(function useLog(ctx, options) {
 *  // 未指定类型时，dataSource 为 UserInfo[]
 *  const { dataSource } = ctx
 *  console.log(`${options?.prefix}:log`)
 *  return ctx
 * })
 *
 * log({ prefix: "" })
 *
 * // 参数声明类型，参数必填
 * // 数据为泛型
 * const log = createMiddleware(function useLog<T>(ctx: MiddlewareContext<T>, options: { prefix: string }) {
 *  // 未指定类型时，dataSource 为 UserInfo[]
 *  const { dataSource } = ctx
 *  console.log(`${options?.prefix}:log`)
 *  return ctx
 * })
 *
 * log<UserInfo>({ prefix: "" })
 * ```
 */
function createMiddleware<T = any, P = void>(middleware: MiddlewareWithOptions<T, P>) {
  const cache = {
    current: null as Middleware<T> | null,
    options: null as P | null,
  }

  return (options: P): Middleware<T> => {
    // eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
    const useMiddleware: Middleware<T> = (ctx) => {
      return middleware(ctx, options)
    }

    if (isShallowEqual(options, cache.options)) {
      return cache.current ?? useMiddleware
    }

    cache.options = options
    cache.current = useMiddleware

    return useMiddleware
  }
}

export { createMiddleware }
