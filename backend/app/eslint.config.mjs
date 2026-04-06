// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "eslint.config.mjs",
      "dist",
      "node_modules",
      "coverage",
      "**/*.spec.ts",
      "**/*.e2e-spec.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      unicorn,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/class-literal-property-style": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-dupe-class-members": "error",
      "@typescript-eslint/no-empty-function": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase", "PascalCase", "snake_case"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase", "snake_case"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE", "camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase", "PascalCase"],
          trailingUnderscore: "allow",
          leadingUnderscore: "allow",
        },
        {
          selector: "classProperty",
          format: ["camelCase", "snake_case", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: ["camelCase", "snake_case", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "objectLiteralProperty",
          format: ["camelCase", "snake_case", "PascalCase"],
          leadingUnderscore: "allow",
        },
      ],
      "import/order": "off",
      "import/no-unresolved": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          ignore: [/\.e2e\.ts$/, /\.spec\.ts$/, /^ignore/i],
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
  },
];
