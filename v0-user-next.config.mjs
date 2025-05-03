/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // ESLint hataları build sırasında görmezden gelinecek
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

