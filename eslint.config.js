import globals from "globals";
import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2025,
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
      },
    },
  },
];