/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // Ignore ESLint errors during the build
    },
    typescript: {
      ignoreBuildErrors: true, // Ignore TypeScript errors during the build
    },
    webpack: (config, { isServer }) => {
      // Fix issues with missing modules
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          encoding: false,
        };
      }
  
      return config;
    },
  };
  
  export default nextConfig;
  