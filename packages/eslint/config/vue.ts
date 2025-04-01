import type { Linter } from 'eslint'
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks'
import type { TypedFlatConfigItem } from '../types'
import { mergeProcessors } from 'eslint-merge-processors'
import pluginVue from 'eslint-plugin-vue'
import processorVueBlocks from 'eslint-processor-vue-blocks'
import tseslint from 'typescript-eslint'
import parserVue from 'vue-eslint-parser'

export interface OptionsVue {
  typescript?: boolean
  jsx?: boolean
  version?: 2 | 3
  overrides?: Linter.Config['rules']
  indent?: number | 'tab'
  sfcBlocks?: boolean | VueBlocksOptions
}

export default function vue(options: OptionsVue) {
  const { typescript = false, version = 3, overrides, indent = 2, jsx = true } = options

  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {}

  const scriptLangs = ['js', 'ts']
  if (jsx) {
    scriptLangs.push('jsx')
  }
  if (jsx && typescript) {
    scriptLangs.push('tsx')
  }

  const config: TypedFlatConfigItem[] = [
    { name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },
    {
      name: 'vue/setup',
      languageOptions: {
        sourceType: 'module',
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      plugins: { vue: pluginVue },
    },
    {
      name: 'eslint-vue/rules',
      files: ['*.vue', '**/*.vue'],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaVersion: 2024,
          ecmaFeatures: { jsx },
          extraFileExtensions: ['.vue'],
          parser: { js: 'espree', jsx: 'espree', ts: tseslint.parser, tsx: tseslint.parser },
          sourceType: 'module',
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      processor: sfcBlocks === false
        ? pluginVue.processors['.vue']
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        : mergeProcessors([
            pluginVue.processors['.vue'],
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks,
              },
            }),
          ]),
      rules: {
        ...pluginVue.configs.base.rules,
        ...version === 2
          ? {
              ...pluginVue.configs['vue2-essential'].rules,
              ...pluginVue.configs['vue2-strongly-recommended'].rules,
              ...pluginVue.configs['vue2-recommended'].rules,
            }
          : {
              ...pluginVue.configs['flat/essential'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
              ...pluginVue.configs['flat/strongly-recommended'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
              ...pluginVue.configs['flat/recommended'].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}),
            },
        'vue/block-order': ['error', {
          order: ['script', 'template', 'style'],
        }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],

        'vue/component-tags-order': 'off',
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        }],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

        // stylistic
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/block-tag-newline': ['error', {
          multiline: 'always',
          singleline: 'always',
        }],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/html-comment-content-spacing': ['error', 'always', {
          exceptions: ['-'],
        }],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/space-in-parens': ['error', 'never'],
        'vue/template-curly-spacing': 'error',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/block-lang': [
          'error',
          {
            script: {
              lang: scriptLangs,
              allowNoLang: scriptLangs.includes('js'),
            },
          },
        ],
        'vue/comment-directive': 'error',
        'vue/jsx-uses-vars': 'error',
        ...overrides,
      },
    },
  ]

  return config
}
