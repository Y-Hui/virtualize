import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import ts from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import extensions from 'rollup-plugin-extensions'
import nodeExternals from 'rollup-plugin-node-externals'
import path from 'node:path'
import Logger from '../utils/logger'
import { buildStyle } from './build-style'
import { compile } from './compile'
import { resolve } from './resolve'

export async function buildPackage(name: string, packagePath: string) {
  const log = new Logger(name)

  log.info('start compiling')

  try {
    const root = resolve(packagePath)
    const input = resolve(`${packagePath}/src/index.ts`)
    const output = resolve(`dist/${name}`)

    await compile({
      input,
      output: {
        file: resolve(output, './index.esm.js'),
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        preserveModules: false,
        externalLiveBindings: true,
      },
      external: [
        'react',
        'react-dom',
        /^@are-visual\/virtual-table/,
      ],
      plugins: [
        del({ targets: resolve(`./dist/${name}`) }),
        extensions({ extensions: ['.tsx', '.ts'] }),
        nodeExternals(),
        babel({
          babelHelpers: 'bundled',
          exclude: /node_modules/,
          presets: [
            ['@babel/preset-env', { loose: true }],
            '@babel/preset-react',
            ['@babel/preset-typescript', { optimizeConstEnums: false }],
          ],
          extensions: ['.ts', '.tsx'],
        }),
        ts({
          tsconfig: `${packagePath}/tsconfig.build.json`,
          exclude: ['__tests__'],
          declarationDir: resolve(output, './dts'),
          declaration: true,
          emitDeclarationOnly: true,
          // noEmitOnError: true,
          // outDir: resolve(output, './index.d.ts'),
        }),
        replace({
          preventAssignment: true,
          __DEV__: `process.env.NODE_ENV === 'development'`,
        }),
      ],
    })
    // runCommand('tsc --project ./packages/virtual-table/tsconfig.build.json')
    await compile({
      input: resolve(output, './dts/index.d.ts'),
      output: [{ file: resolve(output, './index.d.ts'), format: 'es' }],
      plugins: [
        del({ targets: resolve(output, './dts'), hook: 'buildEnd' }),
        dts(),
        copy({
          targets: [
            { src: path.join(root, 'package.json'), dest: resolve(`dist/${name}`) },
          ],
          verbose: true,
        }),
      ],
    })
    await buildStyle({
      input: resolve(`${packagePath}/src/styles/table.scss`),
      output: resolve(`dist/${name}/styles/table.css`),
      copyTo: resolve(`dist/${name}/styles/table.scss`),
    })
    log.success('Compilation completed.')
  } catch (error) {
    if (typeof error === 'string') {
      log.error(error)
    } else if (error instanceof Error) {
      log.error(error.message)
    } else {
      log.error(String(error))
    }
  }
}
