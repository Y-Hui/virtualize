export function get<T>(obj: Record<string, T>, index: string): T | undefined {
  return obj[index]
}
