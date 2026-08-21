/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.*'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.*:3000'],
    },
  },
};

export default nextConfig;
