/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  
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