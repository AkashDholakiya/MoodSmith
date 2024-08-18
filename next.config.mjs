/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint errors during the build
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors during the build
    },
};

export default nextConfig;