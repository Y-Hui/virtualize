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
