import pluginAntfu from 'eslint-plugin-antfu'

/**
 * @type {import('typescript-eslint').InfiniteDepthConfigWithExtends}
 */
export default {
  name: 'opinionated/rules',
  plugins: {
    antfu: pluginAntfu,
  },
  rules: {
    'antfu/consistent-chaining': 'error',
    'antfu/consistent-list-newline': 'error',
    'antfu/curly': 'error',
    'antfu/if-newline': 'off',
    'antfu/top-level-function': 'error',
    'antfu/no-top-level-await': 'error',
    'antfu/import-dedupe': 'error',
    'antfu/no-import-dist': 'error',
    'antfu/no-import-node-modules-by-path': 'error',
  },
}
