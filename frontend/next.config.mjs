/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'bigbestow.com',
      },
      {
        protocol: 'http',
        hostname: '129.121.125.62',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const cleanUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

    return [
      {
        source: '/api/:path*',
        destination: `${cleanUrl}/api/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${cleanUrl}/storage/:path*`,
      },
      {
        source: '/sanctum/:path*',
        destination: `${cleanUrl}/sanctum/:path*`,
      },
      {
        source: '/coupons/:path*',
        destination: `${cleanUrl}/api/coupons/:path*`,
      },
      {
        source: '/register',
        destination: `${cleanUrl}/register`,
      },
      {
        source: '/password/:path*',
        destination: `${cleanUrl}/password/:path*`,
      },
      {
        source: '/email/:path*',
        destination: `${cleanUrl}/email/:path*`,
      },
    ];
  },
};

export default nextConfig;
