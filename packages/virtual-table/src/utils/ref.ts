import type { MutableRefObject, Ref } from 'react'
import { useCallback } from 'react'

type PossibleRef<T> = Ref<T> | undefined

export function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    (ref as MutableRefObject<T>).current = value
  }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node))
  }
}

export function useMergedRef<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-compiler/react-compiler
  return useCallback(mergeRefs(...refs), refs)
}
