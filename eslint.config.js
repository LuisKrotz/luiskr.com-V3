import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    // Generated build output, vendored/public assets, and scratch work are
    // outside the lint gate (which covers src + tests).
    ignores: [
      '**/dist/**',
      'public/**',
      'scratch/**',
      'coverage/**',
      'reports/**',
      'node_modules/**',
      'vendor/**',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: [
      'src/registerServiceWorker.{js,ts}',
      // Node-side tooling: vite config, build/scan scripts, CJS configs.
      'eslint.config.js',
      'vite.config.js',
      'vite.config.*.js',
      'jest.config.js',
      'lighthouserc.cjs',
      'scripts/**/*.{js,mjs,cjs}',
      'tasks/**/*.{js,mjs,cjs}',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Test files run under Jest — declare its globals so no-undef doesn't
    // flag describe/test/expect/etc.
    files: ['tests/**/*.{js,ts,tsx}', '**/*.test.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  js.configs.recommended,
  // TypeScript-aware linting for .ts/.tsx sources (non-type-checked rules).
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ['{src,core,website,cms,experiments}/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
  })),
  {
    files: ['{src,core,website,cms,experiments}/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    rules: {
      // Base rule misfires on TS type positions — the TS-aware variant below
      // (from typescript-eslint recommended) handles them instead.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(h|_)',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    // JS only — the base rule misfires on TS type positions (this-params,
    // interface signatures); TS files use @typescript-eslint/no-unused-vars.
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(h|_)',
        },
      ],
    },
  },
]
