/* eslint-disable @typescript-eslint/no-explicit-any */
export type validObjectValue = Record<string, any> | null | undefined
export type validArrayValue = any[] | null | undefined

export function shallowEqualObjects(
  objA: validObjectValue,
  objB: validObjectValue,
): boolean {
  if (objA === objB) {
    return true
  }

  if (!objA || !objB) {
    return false
  }

  const aKeys = Object.keys(objA)
  const bKeys = Object.keys(objB)
  const len = aKeys.length

  if (bKeys.length !== len) {
    return false
  }

  for (let i = 0; i < len; i += 1) {
    const key = aKeys[i]

    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false
    }
  }

  return true
}

export function shallowEqualArrays(
  arrA: validArrayValue,
  arrB: validArrayValue,
): boolean {
  if (arrA === arrB) {
    return true
  }

  if (!arrA || !arrB) {
    return false
  }

  const len = arrA.length

  if (arrB.length !== len) {
    return false
  }

  for (let i = 0; i < len; i += 1) {
    if (arrA[i] !== arrB[i]) {
      return false
    }
  }

  return true
}

export function isShallowEqual(value: unknown, oldValue: unknown) {
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
            return shallowEqualObjects(
              state as Record<string, unknown>,
              oldValue[index] as Record<string, unknown>,
            )
          }
          return Object.is(state, oldValue[index])
        })
      }
    }
    return false
  }
  if (value instanceof Map && oldValue instanceof Map) {
    const keys = Array.from(value.keys())
    const oldKeys = Array.from(oldValue.keys())
    if (isShallowEqual(keys, oldKeys)) {
      const values = Array.from(value.values())
      const oldValues = Array.from(oldValue.values())
      if (isShallowEqual(values, oldValues)) {
        return true
      }
    }
    return false
  }
  if (typeof value === 'object' && value != null) {
    return shallowEqualObjects(value, oldValue as Record<string, unknown>)
  }
  return false
}
