export function filterMap<K, V>(value: Map<K, V>, pattern: (v: V, k: K) => boolean) {
  const result: V[] = []
  value.forEach((v, k) => {
    if (pattern(v, k)) {
      result.push(v)
    }
  })
  return result
}
