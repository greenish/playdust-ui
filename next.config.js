// https://github.com/facebookexperimental/Recoil/issues/733
const intercept = require('intercept-stdout')
intercept((text) => (text.includes('Duplicate atom key') ? '' : text))

const { PLAYDUST_API_HOST } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/cdn/:path*',
      destination: 'https://cdn.playdust.dev/api/image:path*',
    },
    {
      source: '/playdust-api/:path*',
      destination: `${PLAYDUST_API_HOST}/:path*`,
    },
  ],
  ignoreDuringBuilds: true,
}

module.exports = nextConfig
