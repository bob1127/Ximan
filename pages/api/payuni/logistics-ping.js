// pages/api/payuni/logistics-ping.js
import crypto from "crypto";
import querystring from "querystring";

function encryptPayUniGCM(plaintext, keyBuf, ivBuf) {
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuf, ivBuf);
  let cipherText = cipher.update(plaintext, "utf8", "base64");
  cipherText += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");
  return Buffer.from(`${cipherText}:::${tag}`).toString("hex").trim();
}

function sha256PayUni(encryptStr, keyRaw, ivBuf) {
  return crypto
    .createHash("sha256")
    .update(`${keyRaw}${encryptStr}${ivBuf.toString()}`)
    .digest("hex")
    .toUpperCase();
}

export default async function handler(req, res) {
  try {
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;

    const SHIP_MAP_URL =
      process.env.PAYUNI_LOGISTICS_SHIP_MAP_URL ||
      "https://sandbox-api.payuni.com.tw/api/logistics/ship_map";

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL; // 先用 ngrok https

    if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL) {
      return res.status(400).json({
        ok: false,
        message:
          "Missing env: PAYUNI_MERCHANT_ID/PAYUNI_HASH_KEY/PAYUNI_HASH_IV/NEXT_PUBLIC_SITE_URL",
      });
    }

    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    // 用最基本必填組一包（依文件：MerID, Timestamp, MerKeyNo, GoodsType, LgsType, ShipType, MapType, MapReturnURL...）
    // 這裡先用最常見的：7-11 / 常溫 / C2C / 本島
    const payload = {
      MerID,
      Version: "1.1",
      Timestamp: Math.floor(Date.now() / 1000),
      MerKeyNo: "1",        // 你後台若有指定可改；先用 1
      GoodsType: 1,         // 1=常溫
      LgsType: "C2C",       // 店到店
      ShipType: 1,          // 1=7-ELEVEN
      MapType: 1,           // 1=僅限本島
      MapReturnURL: `${SITE_URL}/api/payuni/map-return-test`,
    };

    const plaintext = querystring.stringify(payload);
    const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

    // ship_map 是 Form Post（不是 JSON）
    const form = new URLSearchParams();
    form.append("MerID", MerID);
    form.append("Version", "1.1");
    form.append("EncryptInfo", EncryptInfo);
    form.append("HashInfo", HashInfo);

    const r = await fetch(SHIP_MAP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const text = await r.text();

    // ship_map 正常情況會回一個 HTML（地圖頁），錯誤也可能是 HTML
    return res.status(200).json({
      ok: true,
      shipMapUrl: SHIP_MAP_URL,
      status: r.status,
      contentType: r.headers.get("content-type"),
      preview: text.slice(0, 500),
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e?.message || "error" });
  }
}
