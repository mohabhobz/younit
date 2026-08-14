import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // public/ holds third-party bundles and the client's own lesson decks —
  // neither is ours to lint.
  { ignores: ['dist', 'node_modules', 'public'] },
  {
    files: ['vite.config.js', 'eslint.config.js', 'tools/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
]
