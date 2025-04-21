/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Указываем, что мы используем только App Router
  experimental: {
    appDir: true,
  },
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
}

export default nextConfig
