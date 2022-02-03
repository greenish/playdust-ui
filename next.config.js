// https://github.com/facebookexperimental/Recoil/issues/733
const intercept = require('intercept-stdout')
intercept((text) => (text.includes('Duplicate atom key') ? '' : text))

const { PLAYDUST_API_HOST, AUCTION_HOUSE_PATH } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/cdn/:path*',
      destination: 'https://d11xo727u371rp.cloudfront.net/:path*',
    },
    {
      source: '/auction-house/:path*',
      destination: `${PLAYDUST_API_HOST}/${AUCTION_HOUSE_PATH}/:path*`,
    },
  ],
}

module.exports = nextConfig
