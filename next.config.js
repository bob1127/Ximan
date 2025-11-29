const path = require("path");

module.exports = {
  images: {
   // 這裡設定允許所有 HTTPS 和 HTTP 的來源
   remotePatterns: [
      {
        protocol: "https",
        hostname: "hfa-mqt-qoqix3fm.landinghub.site",
      },
      {
        protocol: "https",
        hostname: "d2w53g1q050m78.cloudfront.net", // 你的圖片網址中也有這個 CDN，建議一併加入
      },
      // 保留萬用字元以備不時之需
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["gsap"], // <--- ADD THIS
  trailingSlash: true,
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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://external-api.com/:path*",
      },
    ];
  },

  // ⬇️ 加入 WebGL Shader 支援設定
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: ["babel-loader", "babel-plugin-glsl"],
    });
    return config;
  },
};
