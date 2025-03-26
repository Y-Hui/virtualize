import type { TypedFlatConfigItem } from '../types'
import pluginImport from 'eslint-plugin-import-x'

export default {
  name: 'imports/rules',
  plugins: {
    import: pluginImport,
  },
  rules: {
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
    'import/no-self-import': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
  },
} satisfies TypedFlatConfigItem
