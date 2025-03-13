/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude test directories from being processed by Next.js
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Exclude test files and directories from being included in the build
  webpack(config, { isServer }) {
    // Explicitly exclude test directories from webpack processing
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/tests/**', '**/node_modules/**', '**/.git/**', '**/*.spec.*', '**/*.test.*', '**/playwright*/**'],
    };

    // Additional exclusion for test-related files
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@playwright/test': false,
        'playwright': false,
        '__tests__': false
      };
    }

    return config;
  },

  // Existing config (if any)
  experimental: {
    // Add your experimental features here
  }
}

module.exports = nextConfig;
