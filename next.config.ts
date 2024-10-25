// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Mengaktifkan mode strict
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Membolehkan semua domain atau spesifik seperti 'encrypted-tbn0.gstatic.com'
      },
    ],
  },
};

export default nextConfig;
