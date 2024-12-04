/* eslint-disable react-compiler/react-compiler */
import { useRef } from 'react'

import { shallowEqualArrays, shallowEqualObjects } from '../../utils/equal'

function isEqual(value: unknown, oldValue: unknown) {
  if (Object.is(value, oldValue)) {
    return true
  }
  if (Array.isArray(value) && Array.isArray(oldValue)) {
    if (shallowEqualArrays(value, oldValue)) {
      return true
    }
    if (value.length === oldValue.length) {
      const hasObject = value.findIndex((x) => typeof x === 'object' && x != null) > -1
      if (hasObject) {
        return value.every((state, index) => {
          if (Array.isArray(state)) {
            return shallowEqualArrays(state, oldValue[index] as unknown[])
          }
          if (typeof state === 'object' && state != null) {
            return shallowEqualObjects(state, oldValue[index] as Record<string, unknown>)
          }
          return Object.is(state, oldValue[index])
        })
      }
    }
    return false
  }
  if (typeof value === 'object' && value != null) {
    return shallowEqualObjects(value, oldValue as Record<string, unknown>)
  }
  return false
}

/**
 * 缓存数据（浅比较，如果是数组则对第一层进行浅比较）
 */
export function useShallowMemo<T>(pickData: () => T) {
  const nextState = pickData()
  const value = useRef<T>(nextState)

  if (!isEqual(nextState, value.current)) {
    value.current = nextState
  }

  return value.current
}
