import fs from 'node:fs'

export function cleanDir(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
  fs.mkdirSync(dirPath, { recursive: true })
}
