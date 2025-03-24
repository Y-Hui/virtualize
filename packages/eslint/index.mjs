import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import comments from './config/comments.mjs'
import ignores from './config/ignores.mjs'
import imports from './config/imports.mjs'
import node from './config/node.mjs'
import opinionated from './config/opinionated.mjs'
import perfectionist from './config/perfectionist.mjs'
import react from './config/react.mjs'
import typescript from './config/typescript.mjs'
import unicorn from './config/unicorn.mjs'

/**
 * @param {Array<import('typescript-eslint').ConfigWithExtends>} overrides
 */
export default function eslintConfig(...overrides) {
  return tseslint.config(
    {
      files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        sourceType: 'module',
      },
    },
    { ignores: ['**/dist/**/*', '**/node_modules/', '.git/', '**/*.svg'] },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
      files: ['**/*.{js,jsx,mjs,cjs}'],
      extends: [tseslint.configs.disableTypeChecked],
    },
    stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true,
      arrowParens: true,
      braceStyle: '1tbs',
    }),
    imports,
    perfectionist,
    node,
    react,
    typescript,
    comments,
    unicorn,
    ignores(),
    opinionated,
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
        '@typescript-eslint/prefer-nullish-coalescing': 'off'
      },
    },
    ...overrides,
  )
}
