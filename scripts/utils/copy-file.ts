import fs from 'node:fs'

export function copyFile(source: fs.PathLike, destination: fs.PathLike) {
  fs.copyFileSync(source, destination)
}
