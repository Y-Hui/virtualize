import { useRef } from 'react'

export function useLazyRef<T>(initial: () => T) {
  const ref = useRef<T>()
  if (ref.current == null) {
    ref.current = initial()
  }
  return ref as React.MutableRefObject<T>
}
