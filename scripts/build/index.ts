import { cleanDir } from '../utils/clean-dir'
import { copyFile } from '../utils/copy-file'
import { genPath } from '../utils/gen-path'
import { runCommand } from '../utils/run-command'
import { buildMiddlewares } from './build-middlewares'
import { buildPackage } from './build-package'
import { resolve, resolvePackages } from './resolve'

async function main() {
  cleanDir(genPath('/dist'))
  const packageName = 'virtual-table'
  await buildPackage(packageName, resolvePackages(packageName))
  await buildMiddlewares()
  copyFile(resolve('README.md'), resolve('dist/virtual-table/README.md'))
  copyFile(resolve('LICENSE'), resolve('dist/virtual-table/LICENSE'))
  runCommand('tsc --project ./packages/virtual-table/tsconfig.build.utils.json')
}

main()
