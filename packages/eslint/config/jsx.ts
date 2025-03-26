import type { TypedFlatConfigItem } from '../types'

export default function jsx(): TypedFlatConfigItem {
  return {
    files: ['**/*.?([cm])jsx', '**/*.?([cm])tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    name: 'jsx/setup',
  }
}
