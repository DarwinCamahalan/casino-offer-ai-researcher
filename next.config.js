/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    XANO_API_URL: process.env.XANO_API_URL || 'https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB',
  },
}

module.exports = nextConfig
