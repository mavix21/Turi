import baseConfig, { restrictEnvAccess } from "@turi/eslint-config/base";
import nextjsConfig from "@turi/eslint-config/next-js";
import reactConfig from "@turi/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
