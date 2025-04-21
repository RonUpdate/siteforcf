/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  // Добавляем настройку для обработки 404 ошибок
  async rewrites() {
    return [
      // Если страница не найдена, перенаправляем на главную
      {
        source: '/:path*',
        destination: '/',
        has: [
          {
            type: 'header',
            key: 'x-vercel-deployment-url',
            value: '(?<url>.*)',
          },
        ],
        missing: [
          {
            type: 'header',
            key: 'x-middleware-rewrite',
          },
        ],
      },
    ]
  },
}

export default nextConfig
