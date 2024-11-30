export function binarySearchFirstLarger(values: number[], target: number): number {
  let left = 0
  let right = values.length - 1
  let result = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (values[mid] > target) {
      result = mid
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return result
}
