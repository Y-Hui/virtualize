import pluginPerfectionist from 'eslint-plugin-perfectionist'

/**
 * @type {import('typescript-eslint').InfiniteDepthConfigWithExtends}
 */
export default {
  name: 'perfectionist/rules',
  plugins: {
    perfectionist: pluginPerfectionist,
  },
  rules: {
    'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
    'perfectionist/sort-imports': ['error', {
      groups: [
        'side-effect-style',
        'side-effect',
        { newlinesBetween: 'always' },
        'type',
        ['internal-type', 'parent-type', 'sibling-type', 'index-type'],
        'external',
        'builtin',
        'internal',
        ['parent', 'sibling', 'index'],
        'style',
        'object',
        'unknown',
      ],
      newlinesBetween: 'ignore',
      order: 'asc',
      type: 'natural',
    }],
    'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
    'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
  },
}
