import * as sass from 'sass'
import { copyFile } from '../utils/copy-file'
import { writeFile } from '../utils/write-file'

interface BuildStyleArgs {
  input: string
  output: string
  copyTo?: string
}

export function buildStyle(args: BuildStyleArgs) {
  const { input, output, copyTo } = args
  const result = sass.compile(input)
  writeFile(output, result.css)
  if (copyTo != null) {
    copyFile(input, copyTo)
  }
}
