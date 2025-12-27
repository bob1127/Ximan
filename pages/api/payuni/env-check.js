// pages/api/payuni/env-check.js
export default function handler(req, res) {
  const keys = [
    "PAYUNI_MERCHANT_ID",
    "PAYUNI_HASH_KEY",
    "PAYUNI_HASH_IV",
    "NEXT_PUBLIC_SITE_URL",
    "PAYUNI_SHIP_MAP_URL",
    "PAYUNI_LOGISTICS_TRADE_URL",
  ];

  const status = Object.fromEntries(
    keys.map((k) => [k, Boolean(process.env[k])])
  );

  // 不洩漏值，只顯示有/沒有
  res.status(200).json({
    ok: Object.values(status).every(Boolean),
    status,
    runtime: process.env.VERCEL ? "vercel" : "local",
    nodeEnv: process.env.NODE_ENV,
  });
}
