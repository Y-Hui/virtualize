import eslintConfig from '@virtualize/eslint'

export default eslintConfig({
  languageOptions: {
    parserOptions: {
      project: [
        './tsconfig.eslint.json',
        './packages/*/tsconfig.json',
      ],
      tsconfigRootDir: import.meta.dirname,
    },
    globals: {
      process: false,
      __DEV__: 'readonly'
    },
  },
})
