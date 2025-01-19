import { runCommand } from '../utils/run-command'
import { buildMiddlewares } from './build-middlewares'
import { buildPackage } from './build-package'
import { resolvePackages } from './resolve'

async function main() {
  const packageName = 'virtual-table'
  await buildPackage(packageName, resolvePackages(packageName))
  await buildMiddlewares()
  runCommand('tsc --project ./packages/virtual-table/tsconfig.build.utils.json')
}

main()
