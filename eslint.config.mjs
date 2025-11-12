import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: ['dist/', 'node_modules/', 'build/', 'coverage/'],
  },
  {
    rules: {
      'no-var': 'warn',
      'no-unused-vars': 'warn',
      'no-unused-private-class-members': 'warn',
      'prefer-const': 'warn',
    },
  },
  eslintConfigPrettier,
]);
