import { genPath } from 'scripts/utils/gen-path'

import { cleanDir } from '../utils/clean-dir'
import { mv } from '../utils/move'
import { runCommand } from '../utils/run-command'

runCommand('pnpm run build --base=/virtualize/', genPath('packages/playground'))
cleanDir(genPath('/dist'))
mv(genPath('packages/playground/dist'), genPath('/dist'))
