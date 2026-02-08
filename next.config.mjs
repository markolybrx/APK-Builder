/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net', // For DALL-E
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // For raw code/images
      },
    ],
  },
};

export default nextConfig;
