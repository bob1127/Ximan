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
    .update(`${keyRaw}${encryptStr}${ivBuf.toString("utf8")}`)
    .digest("hex")
    .toUpperCase();
}

function safePreview(str, n = 800) {
  return String(str || "").replace(/\s+/g, " ").slice(0, n);
}

export default async function handler(req, res) {
  try {
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    // ✅ 統一只用這個 env
  const SHIP_MAP_URL =
  process.env.PAYUNI_SHIP_MAP_URL ||
  "https://sandbox-api.payuni.com.tw/api/logistics/ship_map";


    if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL || !SHIP_MAP_URL) {
      return res.status(400).json({
        ok: false,
        message:
          "Missing env: PAYUNI_MERCHANT_ID / PAYUNI_HASH_KEY / PAYUNI_HASH_IV / NEXT_PUBLIC_SITE_URL / PAYUNI_SHIP_MAP_URL",
      });
    }

    // ⚠️ 先維持 utf8（如果你確認 key/iv 是 hex，再改成 Buffer.from(x,'hex')）
    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    const payload = {
      MerID,
      Version: "1.1",
      Timestamp: Math.floor(Date.now() / 1000),
      MerKeyNo: "1",
      GoodsType: 1,
      LgsType: "C2C",
      ShipType: 1,
      MapType: 1,
      MapReturnURL: `${SITE_URL}/api/payuni/map-return-test`,
    };

    const plaintext = querystring.stringify(payload);
    const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

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
    return res.status(200).json({
      ok: r.ok,
      shipMapUrl: SHIP_MAP_URL,
      status: r.status,
      contentType: r.headers.get("content-type"),
      preview: safePreview(text),
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e?.message || "error" });
  }
}
