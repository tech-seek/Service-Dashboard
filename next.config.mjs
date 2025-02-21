/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        trustHost: true, // ONLY USE IN DEVELOPMENT AND WITH EXTREME CAUTION. DO NOT USE IN PRODUCTION.
    },
};

export default nextConfig;
