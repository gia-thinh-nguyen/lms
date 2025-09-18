/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // tell Next the real workspace root to silence warnings & avoid confusion
    root: __dirname,
  },
};
module.exports = nextConfig;