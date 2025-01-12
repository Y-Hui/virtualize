import eslintConfig from '@virtualize/eslint'

export default eslintConfig({
  languageOptions: {
    parserOptions: {
      // projectService: true,
      project: [
        './tsconfig.json',
        // './packages/*/tsconfig.json',
      ],
      tsconfigRootDir: import.meta.dirname,
    },
    globals: {
      process: false,
    },
  },
})
