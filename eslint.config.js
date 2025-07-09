// @ts-check
const tseslint = require("typescript-eslint");
const globals = require("globals");
const eslintPluginImport = require("eslint-plugin-import");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
  // The 'extends' section from your old config is now replaced by these imported configs.
  ...tseslint.configs.recommendedTypeChecked, // Includes recommended and recommended-requiring-type-checking
  {
    // Config for eslint-plugin-import
    plugins: {
      import: eslintPluginImport,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      ...eslintPluginImport.configs.errors.rules,
      ...eslintPluginImport.configs.warnings.rules,
      ...eslintPluginImport.configs.typescript.rules,
    },
  },

  // Main configuration object for your project files
  {
    files: ["src/**/*.ts"], // Apply this configuration to all .ts files in the src directory
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2019,
      },
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
      },
    },
    // Your custom rules from the old config
    rules: {
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-parameter-properties": "off",
      "@typescript-eslint/no-shadow": [
        "error",
        {
          hoist: "all",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/space-within-parens": ["off", "never"],
      "@typescript-eslint/unified-signatures": "error",
      "arrow-parens": ["off", "as-needed"],
      camelcase: "error",
      complexity: "off",
      "dot-notation": "error",
      "eol-last": "off",
      eqeqeq: ["error", "smart"],
      "guard-for-in": "off",
      "id-blacklist": ["error", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined"],
      "id-match": "error",
      "linebreak-style": "off",
      "max-classes-per-file": ["error", 1],
      "new-parens": "off",
      "newline-per-chained-call": "off",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-cond-assign": "error",
      "no-console": "off",
      "no-eval": "error",
      "no-invalid-this": "off",
      "no-multiple-empty-lines": "off",
      "no-new-wrappers": "error",
      "no-shadow": "off",
      "no-throw-literal": "error",
      "no-trailing-spaces": "off",
      "no-undef-init": "error",
      "no-underscore-dangle": ["warn", { "allowAfterThis": true, "enforceInClassFields": false }],
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "quote-props": "off",
      radix: "error",
      "sort-imports": "warn",
      "spaced-comment": "error",
    },
  },

  // This should be the LAST configuration. It disables styling rules that conflict with Prettier.
  prettierConfig
);
