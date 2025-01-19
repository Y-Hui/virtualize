import { useCallback, useLayoutEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useStableFn<T extends Function>(callback: T): T {
  const fn = useRef<T | null>(null)
  useLayoutEffect(() => {
    fn.current = callback
  }, [callback])

  const stableFn = useCallback((...args: unknown[]) => {
    return fn.current?.(...args) as unknown
  }, []) as unknown as T

  return stableFn
}
