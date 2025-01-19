import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function resolve(...pathName: string[]) {
  return path.resolve(__dirname, '../../', ...pathName)
}

export function resolvePackages(name?: string) {
  if (name == null) return resolve('./packages/')
  return resolve('./packages/', name)
}
