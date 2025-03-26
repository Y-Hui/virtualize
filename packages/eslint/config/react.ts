import type { Linter } from 'eslint'
import type { TypedFlatConfigItem } from '../types'
import reactPlugin from '@eslint-react/eslint-plugin'
import * as reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

const plugins = reactPlugin.configs.all.plugins

export interface OptionsReact {
  compilerRules?: boolean
  overrides?: Linter.Config['rules']
}

export default function react(options: OptionsReact): TypedFlatConfigItem[] {
  const { overrides, compilerRules = true } = options

  const config: TypedFlatConfigItem[] = [
    {
      name: 'react/rules',
      files: ['**/*.?([cm])[jt]s?(x)'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        '@eslint-react': plugins['@eslint-react'],
        '@eslint-react/dom': plugins['@eslint-react/dom'],
        '@eslint-react/hooks-extra': plugins['@eslint-react/hooks-extra'],
        '@eslint-react/naming-convention': plugins['@eslint-react/naming-convention'],
        '@eslint-react/web-api': plugins['@eslint-react/web-api'],
      },
      rules: {
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        '@eslint-react/hooks-extra/no-unnecessary-use-memo': 'off',
        'react-refresh/only-export-components': 'off',
        '@eslint-react/naming-convention/filename': 'off',
        '@eslint-react/avoid-shorthand-fragment': 'off',
        '@eslint-react/avoid-shorthand-boolean': 'off',
        '@eslint-react/naming-convention-use-state': 'off',
        '@eslint-react/hooks-extra/ensure-use-memo-has-non-empty-deps': 'off',
        '@eslint-react/naming-convention/filename-extension': [
          'warn',
          { allow: 'always', extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] },
        ],
        '@eslint-react/no-leaked-conditional-rendering': 'warn',
        '@eslint-react/dom/no-children-in-void-dom-elements': 'warn',
        '@eslint-react/dom/no-dangerously-set-innerhtml': 'warn',
        '@eslint-react/dom/no-dangerously-set-innerhtml-with-children': 'error',
        '@eslint-react/dom/no-find-dom-node': 'error',
        '@eslint-react/dom/no-missing-button-type': 'warn',
        '@eslint-react/dom/no-missing-iframe-sandbox': 'warn',
        '@eslint-react/dom/no-namespace': 'error',
        '@eslint-react/dom/no-render-return-value': 'error',
        '@eslint-react/dom/no-script-url': 'warn',
        '@eslint-react/dom/no-unsafe-iframe-sandbox': 'warn',
        '@eslint-react/dom/no-unsafe-target-blank': 'warn',
        '@eslint-react/web-api/no-leaked-event-listener': 'warn',
        '@eslint-react/web-api/no-leaked-interval': 'warn',
        '@eslint-react/web-api/no-leaked-resize-observer': 'warn',
        '@eslint-react/web-api/no-leaked-timeout': 'warn',
        '@eslint-react/ensure-forward-ref-using-ref': 'warn',
        '@eslint-react/jsx-no-duplicate-props': 'warn',
        '@eslint-react/jsx-uses-vars': 'warn',
        '@eslint-react/no-access-state-in-setstate': 'error',
        '@eslint-react/no-array-index-key': 'warn',
        '@eslint-react/no-children-count': 'warn',
        '@eslint-react/no-children-for-each': 'warn',
        '@eslint-react/no-children-map': 'warn',
        '@eslint-react/no-children-only': 'warn',
        '@eslint-react/no-children-to-array': 'warn',
        // '@eslint-react/no-clone-element': 'off',
        '@eslint-react/no-comment-textnodes': 'warn',
        '@eslint-react/no-component-will-mount': 'error',
        '@eslint-react/no-component-will-receive-props': 'error',
        '@eslint-react/no-component-will-update': 'error',
        '@eslint-react/no-context-provider': 'warn',
        '@eslint-react/no-create-ref': 'error',
        '@eslint-react/no-default-props': 'error',
        '@eslint-react/no-direct-mutation-state': 'error',
        '@eslint-react/no-duplicate-key': 'error',
        '@eslint-react/no-forward-ref': 'warn',
        '@eslint-react/no-implicit-key': 'warn',
        '@eslint-react/no-missing-key': 'error',
        '@eslint-react/no-nested-components': 'error',
        '@eslint-react/no-prop-types': 'error',
        '@eslint-react/no-redundant-should-component-update': 'error',
        '@eslint-react/no-set-state-in-component-did-mount': 'warn',
        '@eslint-react/no-set-state-in-component-did-update': 'warn',
        '@eslint-react/no-set-state-in-component-will-update': 'warn',
        '@eslint-react/no-string-refs': 'error',
        '@eslint-react/no-unsafe-component-will-mount': 'warn',
        '@eslint-react/no-unsafe-component-will-receive-props': 'warn',
        '@eslint-react/no-unsafe-component-will-update': 'warn',
        '@eslint-react/no-unstable-context-value': 'warn',
        '@eslint-react/no-unstable-default-props': 'warn',
        '@eslint-react/no-unused-class-component-members': 'warn',
        '@eslint-react/no-unused-state': 'warn',
        '@eslint-react/prefer-destructuring-assignment': 'warn',
        '@eslint-react/prefer-shorthand-boolean': 'warn',
        '@eslint-react/prefer-shorthand-fragment': 'warn',
        ...overrides,
      },
    },
  ]
  if (compilerRules) {
    config.push(reactCompiler.configs.recommended)
  }

  return config
}
