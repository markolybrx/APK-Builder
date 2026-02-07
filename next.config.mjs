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
  // We removed 'maxDuration' from here because it causes the crash.
  // It must be added to the individual API route files instead.
};

export default nextConfig;
