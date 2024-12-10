import fs from 'node:fs'

export function mv(source: string, target: string) {
  fs.renameSync(source, target)
}
