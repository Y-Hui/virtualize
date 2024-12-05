export type FixedType = 'left' | 'right'

export function isValidFixedLeft(fixed: unknown) {
  return fixed === 'left'
}

export function isValidFixedRight(fixed: unknown) {
  return fixed === 'right'
}

export function isValidFixed(fixed: unknown) {
  return isValidFixedLeft(fixed) || isValidFixedRight(fixed)
}
