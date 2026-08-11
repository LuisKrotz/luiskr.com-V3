import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import prettierConfig from '@vue/eslint-config-prettier'
import globals from 'globals'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },
  {
    files: ['src/registerServiceWorker.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettierConfig,
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
        svg: 'always',
        math: 'always',
      }],
    },
  },
]
