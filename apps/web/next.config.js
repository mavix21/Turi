import { fileURLToPath } from "url";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@turi/ui"],

  // Mark pino and thread-stream as external to prevent bundling their test files
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],

  // Webpack configuration (for fallback when not using Turbopack)
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config, { webpack }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Ignore thread-stream test files that require tap/tape/why-is-node-running
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(tap|tape|why-is-node-running|desm)$/,
      }),
    );
    return config;
  },

  // Enable typed routes
  typedRoutes: true,

  /** We already do linting and typechecking as separate tasks in CI */
  // eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

const withNextIntl = createNextIntlPlugin("./app/_shared/i18n/request.ts");

export default withNextIntl(config);
