import { type MutableRefObject, type Ref } from 'react'

export const fillRef = <T>(ref: Ref<T>, node: T) => {
  if (typeof ref === 'function') {
    ref(node)
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    // eslint-disable-next-line no-param-reassign
    (ref as MutableRefObject<unknown>).current = node
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
export const composeRef = <T>(...refs: (Ref<T> | undefined | null)[]): Ref<T> => {
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
