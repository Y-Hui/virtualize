import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { Linter } from 'eslint'
import type { OptionsReact } from './config/react'
import type { OptionsTs } from './config/typescript'
import type { OptionsVue } from './config/vue'
import type { TypedFlatConfigItem } from './types'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

import comments from './config/comments'
import ignores from './config/ignores'
import imports from './config/imports'
import jsx from './config/jsx'
import node from './config/node'
import opinionated from './config/opinionated'
import perfectionist from './config/perfectionist'
import react from './config/react'
import typescript from './config/typescript'
import unicorn from './config/unicorn'
import vue from './config/vue'

interface EslintConfigOptions {
  typescript?: boolean | OptionsTs
  jsx?: boolean
  /**
   * Enable Vue support
   */
  vue?: boolean | Omit<OptionsVue, 'typescript'>
  /**
   * Enable react rules
   */
  react?: boolean | OptionsReact
}

export default function eslintConfig(options: EslintConfigOptions, ...userConfigs: Linter.Config[]) {
  const {
    typescript: ts = true,
    jsx: enableJsx = true,
    vue: enableVue = false,
    react: enableReact = false,
  } = options

  const enableTypeScript = ts === true || typeof ts === 'object'

  const stylisticOptions: StylisticCustomizeOptions = {
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: enableJsx,
    arrowParens: true,
    braceStyle: '1tbs',
  }

  const configs: TypedFlatConfigItem[] = [
    stylistic.configs.customize(stylisticOptions),
  ]

  const componentExts: string[] = []

  if (enableVue === true || typeof enableVue === 'object') {
    componentExts.push('vue')
  }

  if (enableTypeScript) {
    if (typeof ts === 'object') {
      // @ts-expect-error ignore this error
      configs.push(...typescript({ componentExts, ...ts }))
    } else {
      // @ts-expect-error ignore this error
      configs.push(...typescript({ componentExts }))
    }
  }

  if (enableJsx) {
    configs.push(jsx())
  }

  if (enableVue === true || typeof enableVue === 'object') {
    if (typeof enableVue === 'object') {
      configs.push(...vue({
        indent: stylisticOptions.indent,
        ...enableVue,
        jsx: enableJsx,
        typescript: enableTypeScript,
      }))
    } else {
      configs.push(...vue({
        indent: stylisticOptions.indent,
        jsx: enableJsx,
        typescript: enableTypeScript,
      }))
    }
  }

  if (enableReact === true || typeof enableReact === 'object') {
    if (typeof enableReact === 'object') {
      configs.push(...react(enableReact))
    } else {
      configs.push(...react({}))
    }
  }

  configs.push(
    comments,
    ignores(),
    imports,
    node,
    opinionated,
    perfectionist,
    unicorn,
    {
      files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        sourceType: 'module',
      },
    },
    {
      ignores: ['**/dist/**/*', '**/node_modules/', '.git/', '**/*.svg'],
    },
    {
      rules: {
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'eqeqeq': ['error', 'always', { null: 'ignore' }],
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
      },
    },
    ...userConfigs,
  )

  return configs
}
