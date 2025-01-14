import type { MutableRefObject, Ref } from 'react'

export function fillRef<T>(ref: Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node)
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as MutableRefObject<unknown>).current = node
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef<T>(...refs: (Ref<T> | undefined | null)[]): Ref<T> {
  const refList = refs.filter(Boolean) as Ref<T>[]
  if (refList.length <= 1) {
    return refList[0]
  }
  return (node: T) => {
    refs.forEach((ref) => {
      fillRef(ref as Ref<T>, node)
    })
  }
}
