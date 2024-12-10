import path from 'node:path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function genPath(...paths: string[]) {
  return path.join(__dirname, '../../', ...paths)
}
