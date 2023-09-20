/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.BASE_PATH || "",
  basePath: process.env.BASE_PATH || "",
  trailingSlash: true,
  publicRuntimeConfig: {
    root: process.env.BASE_PATH || "",
  },
  optimizeFonts: false,
  env: {
    openAiKey: process.env.OPENAI_KEY,
    voicevoxKey: process.env.VOICEVOX_KEY,
  },
};

module.exports = nextConfig;
