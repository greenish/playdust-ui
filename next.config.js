// https://github.com/facebookexperimental/Recoil/issues/733
const intercept = require('intercept-stdout')
intercept((text) => (text.includes('Duplicate atom key') ? '' : text))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/cdn/:path*',
      destination: 'https://d11xo727u371rp.cloudfront.net/:path*',
    },
  ],
}

module.exports = nextConfig
