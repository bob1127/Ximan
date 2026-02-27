/** @type {import('next').NextConfig} */
const path = require("path");
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  reactStrictMode: true,
 
  i18n, // 👉 加入這一行啟用內建多語系路由
  // ... 你原本的其他設定 (images 等)
  // 1. Fix Image Loading
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS images (simplest for dev)
      },
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP images (simplest for dev)
      },
    ],
    // If images still fail, uncomment the line below to disable optimization temporarily
    // unoptimized: true, 
  },

  transpilePackages: ["gsap"],

  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  // 2. Remove the faulty 'rewrites' section that caused 'external-api.com' errors
  // async rewrites() { ... }  <-- REMOVED

  // WebGL / Shader support
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: ["babel-loader", "babel-plugin-glsl"],
    });
    return config;
  },
  
  // 3. Fix Styled-Components hydration mismatch (Optional but recommended)
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;