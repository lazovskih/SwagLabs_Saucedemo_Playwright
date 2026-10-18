import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  // 1. Base JS rules for all files (including config files)
  js.configs.recommended,

  // 2. Playwright and TypeScript config - strictly applied to your test/spec files
  {
    files: ['tests/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      playwright,
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'playwright/missing-playwright-await': [
        'error',
        { customMatchers: [] },
      ],
      'playwright/valid-expect': 'error',
    },
  },

  // 3. Global ignores (optional, but good practice)
  {
    ignores: ['test-results/**', 'playwright-report/**', 'node_modules/**'],
  }
);