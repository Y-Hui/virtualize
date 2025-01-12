import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

import reactCompiler from 'eslint-plugin-react-compiler'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import react from '@eslint-react/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import airbnb from './airbnb.mjs'

/**
 * @param {Array<import('typescript-eslint').ConfigWithExtends>} overrides
 */
export default function eslintConfig(...overrides) {
  return tseslint.config(
    { ignores: ['**/dist/**/*', '**/node_modules/', '.git/', '**/*.svg'] },
    js.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    airbnb,
    react.configs.all,
    stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true,
      arrowParens: true,
      braceStyle: '1tbs',
    }),
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        '@typescript-eslint': tseslint.plugin,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'simple-import-sort': simpleImportSort,
        'react-compiler': reactCompiler,
      },
      rules: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'react-compiler/react-compiler': 'error',
      },
    },
    {
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',

        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
        '@typescript-eslint/no-var-requires': 'off',

        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [
          'error',
          {
            ignoreFunctionTypeParameterNameValueShadow: true,
          },
        ],

        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-empty-object-type': [
          'error',
          {
            allowInterfaces: 'always',
          },
        ],
        '@eslint-react/naming-convention/filename-extension': [
          'warn',
          { allow: 'always', extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] },
        ],
        '@eslint-react/naming-convention/filename': 'off',
        '@eslint-react/prefer-destructuring-assignment': 'error',
        'no-underscore-dangle': 'off',
        '@eslint-react/avoid-shorthand-fragment': 'off',
        '@eslint-react/avoid-shorthand-boolean': 'off',
        '@eslint-react/naming-convention-use-state': 'off',
        'import/prefer-default-export': 'off',
        'react-refresh/only-export-components': 'off',
        '@eslint-react/hooks-extra/ensure-use-memo-has-non-empty-deps': 'off',
        'consistent-return': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        'import/no-absolute-path': 'off',
        '@typescript-eslint/restrict-template-expressions': ['error', {
          allowAny: true,
          allowNumber: true,
          allowBoolean: true,
        }],
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-unnecessary-type-parameters': 'off',
        '@eslint-react/hooks-extra/no-unnecessary-use-memo': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/no-unsafe-argument': 'warn',
      },
    },
    ...overrides,
  )
}
