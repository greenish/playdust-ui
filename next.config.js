// https://github.com/facebookexperimental/Recoil/issues/733
const intercept = require('intercept-stdout')
intercept((text) => (text.includes('Duplicate atom key') ? '' : text))

const { PLAYDUST_API_HOST } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.PD_ENV': JSON.stringify(process.env.PD_ENV),
        'process.env.RPC_NODE_CLUSTER': JSON.stringify(process.env.RPC_NODE_CLUSTER),
        'process.env.RPC_NODE_URL': JSON.stringify(process.env.RPC_NODE_URL),
        'process.env.WHITELIST_ACTIVE': JSON.stringify(process.env.WHITELIST_ACTIVE || false),
        'process.env.HUBSPOT_PORTAL_ID': JSON.stringify(process.env.HUBSPOT_PORTAL_ID),
        'process.env.HUBSPOT_JOIN_WHITELIST_FORM_ID': JSON.stringify(process.env.HUBSPOT_JOIN_WHITELIST_FORM_ID),
      })
    );
    return config;
  },
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
  typescript: {
    tsconfigPath: "tsconfig.json",
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig;
