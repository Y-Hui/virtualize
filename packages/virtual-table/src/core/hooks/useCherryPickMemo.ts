/* eslint-disable react-compiler/react-compiler */
import { useRef } from 'react'

import { shallowEqualArrays, shallowEqualObjects } from '../../utils/equal'

/**
 * 挑选数据的某些部分进行缓存（浅比较）
 */
export function useCherryPickMemo<T>(pickData: () => T) {
  const nextState = pickData()
  const value = useRef<T>(nextState)

  if (Array.isArray(nextState)) {
    if (!shallowEqualArrays(nextState, value.current as unknown[])) {
      value.current = nextState
    }
  }

  if (typeof nextState === 'object' && nextState != null) {
    if (!shallowEqualObjects(nextState, value.current as Record<string, unknown>)) {
      value.current = nextState
    }
  }

  return value.current
}
