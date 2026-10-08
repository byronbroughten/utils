import { eslintPreset, variableNaming } from "@byronbroughten/config/eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
  ...eslintPreset,
  // Domain-free utilities keep bare T, K and V.
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": ["error", variableNaming],
    },
  },
);
