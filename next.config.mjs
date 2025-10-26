/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for static export
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

export default nextConfig
