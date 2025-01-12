/* eslint-disable react-compiler/react-compiler */
import { useRef } from 'react'

import { isShallowEqual } from '../../utils/equal'

/**
 * 缓存数据（浅比较，如果是数组则对第一层进行浅比较）
 */
export function useShallowMemo<T>(pickData: () => T) {
  const nextState = pickData()
  const value = useRef<T>(nextState)

  if (!isShallowEqual(nextState, value.current)) {
    value.current = nextState
  }

  return value.current
}
