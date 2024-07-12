/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",
  browserNodeBuiltinsPolyfill: {
    modules: {
      path: true,
      fs: true,
      vm: true,
      punycode: true,
      util: true,
      buffer: true,
      string_decoder: true,
      events: true,
      os: true,
      crypto: true,
      http: true,
      child_process: true,
      https: true,
      net: true,
      tls: true,
      url: true,
      assert: true,
      stream: true,
      zlib: true,
    },
  },
};
