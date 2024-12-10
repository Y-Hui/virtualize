import fs from 'node:fs'

export function writeFileSync(pathName: string, data: string) {
  const lastPath = pathName.substring(0, pathName.lastIndexOf('/'))
  if (!fs.existsSync(lastPath)) {
    fs.mkdirSync(lastPath, { recursive: true })
  }
  fs.writeFileSync(pathName, data)
}

export function writeFile(pathName: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const lastPath = pathName.substring(0, pathName.lastIndexOf('/'))
    fs.mkdir(lastPath, { recursive: true }, (err) => {
      if (err) {
        reject(err)
        return
      }
      fs.writeFile(pathName, data, (err2) => {
        if (err2) {
          reject(err2)
          return
        }
        resolve()
      })
    })
  })
}
