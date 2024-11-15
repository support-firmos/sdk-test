/** @type {import('next').NextConfig} */
const nextConfig = {
  // Combine existing security headers with new API headers
  headers: async () => {
    return [
      {
        // Global security headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: '',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // API-specific headers
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ];
  },

  // Add env configuration for better type safety
  env: {
    COPILOT_API_KEY: process.env.COPILOT_API_KEY,
  },

  // Recommended Vercel optimization settings
  experimental: {
    serverActions: true,
  },

  // Disable image optimization if you're not using Next.js Image
  images: {
    unoptimized: true,
  },

  // Enable strict mode for better development experience
  reactStrictMode: true,
};

module.exports = nextConfig;