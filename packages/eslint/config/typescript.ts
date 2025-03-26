import type { Linter } from 'eslint'
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint'
import tseslint from 'typescript-eslint'

export interface OptionsTs {
  overrides?: Linter.Config['rules']
  configs?: InfiniteDepthConfigWithExtends[]
}

export default function typescript(options: OptionsTs) {
  const { overrides, configs = [] } = options

  return tseslint.config(
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
      files: ['**/*.{js,jsx,mjs,cjs}'],
      extends: [tseslint.configs.disableTypeChecked],
    },
    {
      name: 'ts/rules',
      files: ['**/*.?([cm])ts', '**/*.?([cm])tsx'],
      rules: {
        '@typescript-eslint/restrict-template-expressions': ['error', {
          allowAny: true,
          allowNumber: true,
          allowBoolean: true,
        }],
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false,
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        }],
        '@typescript-eslint/no-import-type-side-effects': 'error',
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-implied-eval': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/promise-function-async': 'off',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/return-await': ['error', 'in-try-catch'],
        '@typescript-eslint/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/unbound-method': 'error',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-unnecessary-type-parameters': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: false,
          },
        ],
        ...overrides,
      },
    },
    ...configs,
  )
}
