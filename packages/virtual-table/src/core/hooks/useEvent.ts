import { useCallback, useLayoutEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useEvent<T extends Function>(callback: T): T {
  const fn = useRef<T | null>(null)
  useLayoutEffect(() => {
    fn.current = callback
  }, [callback])

  // @ts-expect-error
  const stableFn: T = useCallback((...args: unknown[]) => {
    return fn.current?.(...args)
  }, [])

  return stableFn
}
