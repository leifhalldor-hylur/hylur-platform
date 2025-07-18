/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/api/favicon'
      }
    ]
  }
}

module.exports = nextConfig
