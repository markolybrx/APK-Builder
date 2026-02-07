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
        hostname: 'oaidalleapiprodscus.blob.core.windows.net', // For DALL-E images
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // For viewing raw code/images from repos
      },
    ],
  },
  // Increase timeout for API routes since AI takes time
  maxDuration: 60, 
};

export default nextConfig;
