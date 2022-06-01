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
        'process.env.VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV),
        'process.env.RPC_NODE_CLUSTER': JSON.stringify(process.env.RPC_NODE_CLUSTER),
        'process.env.RPC_NODE_URL': JSON.stringify(process.env.RPC_NODE_URL),
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
