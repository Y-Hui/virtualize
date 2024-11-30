export function findLastIndex<T>(
  arr: T[],
  predicate: (value: T, index: number) => boolean,
) {
  let result = -1
  for (let i = 0; i < arr.length; i += 1) {
    if (predicate(arr[i], i)) {
      result = i
    }
  }
  return result
}
