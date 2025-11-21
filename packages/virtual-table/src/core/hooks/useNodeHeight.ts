import { useRef } from 'react'
import { useStableFn } from './useStableFn'

export function useNodeHeight<T extends HTMLElement>() {
  const nodeRef = useRef<T>(null)

  const getIsVisible = useStableFn(() => {
    const node = nodeRef.current
    if (node == null) return false
    return node.offsetHeight > 0
  })

  return [nodeRef, getIsVisible] as const
}
