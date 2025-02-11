import { cleanDir } from '../utils/clean-dir'
import { genPath } from '../utils/gen-path'
import { mv } from '../utils/move'
import { runCommand } from '../utils/run-command'

runCommand('pnpm run build --base=/virtualize/', genPath('packages/playground'))
cleanDir(genPath('/dist'))
mv(genPath('packages/playground/dist'), genPath('/dist'))

runCommand('pnpm run build --base=/virtualize/tutorial/', genPath('packages/tutorial'))
mv(genPath('packages/tutorial/dist'), genPath('/dist/tutorial'))
