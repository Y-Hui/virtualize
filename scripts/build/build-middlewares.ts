import type { InputOption } from 'rollup'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import ts from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import extensions from 'rollup-plugin-extensions'
import nodeExternals from 'rollup-plugin-node-externals'
import fs from 'node:fs'
import Logger from '../utils/logger'
import { buildStyle } from './build-style'
import { compile } from './compile'
import { resolve } from './resolve'

function resolveMiddleware(...pathName: string[]) {
  return resolve('./packages/virtual-table/src/middleware', ...pathName)
}

const middlewares = fs.readdirSync(resolveMiddleware()).filter((pathName) => {
  const isDirectory = fs.statSync(resolveMiddleware(pathName)).isDirectory()
  if (isDirectory) {
    return fs.existsSync(resolveMiddleware(pathName, `index.tsx`))
  }
  return false
})

export async function buildMiddlewares() {
  const log = new Logger('middleware')

  log.info('start compiling')

  try {
    await middlewares.reduce(async (task, name) => {
      await task
      return compileMiddleware({
        name,
        input: resolveMiddleware(name, `index.tsx`),
        outputDir: resolve(`dist/virtual-table/middleware/${name}`),
        clearDirPath: resolve(`dist/virtual-table/middleware/${name}`),
        tsconfig: resolve('./packages/virtual-table/tsconfig.build.json'),
      })
    }, Promise.resolve())
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

interface CompileMiddlewareArgs {
  name: string
  input: InputOption
  outputDir: string
  clearDirPath: string
  tsconfig: string
}
async function compileMiddleware(args: CompileMiddlewareArgs) {
  const { name, input, outputDir, clearDirPath, tsconfig } = args
  await compile({
    input,
    output: {
      file: resolve(outputDir, './index.js'),
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      preserveModules: false,
      externalLiveBindings: true,
    },
    external: [
      'react',
      'react-dom',
      'react-resizable',
      /^@are-visual\/virtual-table/,
    ],
    plugins: [
      del({ targets: clearDirPath }),
      alias({
        entries: [
          { find: '../../core', replacement: 'virtual-table' },
        ],
      }),
      extensions({ extensions: ['.tsx', '.ts'] }),
      nodeExternals(),
      babel({
        targets: 'defaults, not ie 11, not ie_mob 11',
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
        tsconfig,
        exclude: ['__tests__'],
        declarationDir: resolve(outputDir, './dts'),
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
  await compile({
    input: resolve(outputDir, `./dts/middleware/${name}/index.d.ts`),
    output: [{ file: resolve(outputDir, './index.d.ts'), format: 'es' }],
    external: [
      'react',
      'react-dom',
      'react-resizable',
      'react-resizable/css/styles.css',
      /\.scss$/,
      /^@are-visual\/virtual-table/,
    ],
    plugins: [
      del({ targets: resolve(outputDir, './dts'), hook: 'buildEnd' }),
      alias({
        entries: [
          { find: '../../core', replacement: 'virtual-table' },
        ],
      }),
      dts(),
    ],
  })

  const styles = resolveMiddleware(name, 'styles.scss')
  if (fs.existsSync(styles)) {
    await buildStyle({
      input: styles,
      output: resolve(`dist/virtual-table/middleware/${name}/styles.css`),
      copyTo: resolve(`dist/virtual-table/middleware/${name}/styles.scss`),
    })
  }
}
