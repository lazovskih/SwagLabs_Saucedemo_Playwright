import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default defineConfig([
  // 1. Global ignores
  {
    ignores: ["test-results/**", "playwright-report/**", "blob-report/**", "playwright/.cache/**", "node_modules/**"],
  },

  // 2. Base JS rules
  js.configs.recommended,

  // 3. TypeScript type-checked rules for ALL .ts files (including playwright.config.ts)
  {
    files: ["**/*.ts"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },

  // 4. Playwright recommended rules for test and page object files
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // Allow web-first expect() assertions inside Page Object / Component helper methods
      "playwright/no-standalone-expect": "off",
    },
  },
]);
