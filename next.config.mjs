/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force the output folder to be what Netlify expects
  distDir: '.next',
  
  images: {
    // 2. Disable default optimization (fixes broken images on Netlify)
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
