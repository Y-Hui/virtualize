import pluginComments from '@eslint-community/eslint-plugin-eslint-comments'

/**
 * @type {import('typescript-eslint').InfiniteDepthConfigWithExtends}
 */
export default {
  name: 'comments/rules',
  plugins: {
    'eslint-comments': pluginComments,
  },
  rules: {
    'eslint-comments/no-aggregating-enable': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
  },
}
