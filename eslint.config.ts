import eslintConfig from '@virtualize/eslint'

export default eslintConfig(
  {
    react: true,
    vue: true,
    typescript: {
      configs: [
        {
          languageOptions: {
            parserOptions: {
              project: [
                './tsconfig.eslint.json',
                './packages/*/tsconfig.json',
                './packages/playground-vue/tsconfig.app.json',
                './packages/playground-vue/tsconfig.node.json',
              ],
              tsconfigRootDir: import.meta.dirname,
            },
            globals: {
              process: false,
              __DEV__: 'readonly',
            },
          },
        },
        {
          files: ['packages/tutorial/src/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
          rules: {
            '@typescript-eslint/no-explicit-any': 'off',
          },
        },
      ],
    },
  },
)
