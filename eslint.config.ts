import eslintConfig from '@virtualize/eslint'

export default eslintConfig(
  {
    react: {
      files: [
        'packages/!(*vue*|*-vue)/src/**/*.?([cm])[jt]s?(x)',
      ],
    },
    vue: true,
    typescript: {
      tsconfigPath: 'tsconfig.json',
      parserOptions: {
        project: [
          './tsconfig.json',
          'packages/*/tsconfig.json',
        ],
        extraFileExtensions: ['.vue'],
        globals: {
          process: false,
          __DEV__: 'readonly',
        },
      },
    },
  },
  {
    files: ['packages/tutorial/src/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
