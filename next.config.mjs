/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack to avoid internal errors
  experimental: {
    turbo: false,
  },
}

export default nextConfig
