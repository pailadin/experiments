module.exports = {
  reactStrictMode: true,
  env: {
    appIcon: '/public/favicon.ico',
    appName: 'TokenGating',
    appDescription: 'I guard tokens',
  },
  /**
   * Options for experimental features, but will be great to explore it ahead.
   * @concurrentFeatures used to support react lazy import (counterpart for dynamic import)
   * @serverComponents used to support react server components
   * https://nextjs.org/docs/advanced-features/react-18
   */
  concurrentFeatures: true,
  serverComponents: true,
}
