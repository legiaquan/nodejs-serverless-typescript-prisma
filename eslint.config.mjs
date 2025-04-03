import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import promisePlugin from 'eslint-plugin-promise';

export default [
  // Base config for all files
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.serverless/**',
      '.build/**',
      'coverage/**',
      '**/*.json',
      '**/*.lock',
      '**/*.yml',
      '**/*.yaml',
      'prisma/generated/**',
      'prisma/migrations/**',
      'test-results/**',
      'jest.config.js',
      'commitlint.config.js',
      '**/*.d.ts',
      '**/*.js.map',
      '**/*.min.js',
      '**/*.bundle.js',
      '.git/**',
      '.github/**',
      '.vscode/**',
      'node_modules/.bin/**',
      'node_modules/.cache/**',
      'tests/**',
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
      noInlineConfig: false,
    },
  },
  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...eslint.configs.recommended,
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: false },
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: {
        NodeJS: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      jest: jestPlugin,
      promise: promisePlugin,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  // Apply prettier config to all files
  prettier,
];
