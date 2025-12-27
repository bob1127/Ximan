// pages/api/payuni/cvs/return.js
import crypto from "crypto";
import querystring from "querystring";

function decryptPayUniGCM(encryptHex, keyBuf, ivBuf) {
  const packed = Buffer.from(String(encryptHex || ""), "hex").toString("utf8");
  const [cipherB64, tagB64] = packed.split(":::");
  if (!cipherB64 || !tagB64) throw new Error("EncryptInfo format invalid");

  const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuf, ivBuf);
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));

  let plaintext = decipher.update(cipherB64, "base64", "utf8");
  plaintext += decipher.final("utf8");
  return plaintext;
}

function sha256PayUni(encryptStr, keyRaw, ivBuf) {
  return crypto
    .createHash("sha256")
    .update(`${keyRaw}${encryptStr}${ivBuf.toString()}`)
    .digest("hex")
    .toUpperCase();
}

export default async function handler(req, res) {
  // PayUni 回傳通常是 POST
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL) {
      throw new Error("PayUni env missing");
    }

    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    const body = req.body || {};
    const recvMerID = body.MerID || body.MerId || body.merid;
    const EncryptInfo = body.EncryptInfo || body.encryptInfo || body.Encryptinfo;
    const HashInfo = body.HashInfo || body.hashInfo || body.Hashinfo;

    if (!EncryptInfo || !HashInfo) {
      return res.status(400).send("Missing EncryptInfo/HashInfo");
    }
    if (recvMerID && String(recvMerID) !== String(MerID)) {
      return res.status(400).send("MerID mismatch");
    }

    // 驗 Hash
    const expectedHash = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);
    if (String(HashInfo).toUpperCase() !== expectedHash) {
      return res.status(400).send("HashInfo mismatch");
    }

    // 解密
    const plaintext = decryptPayUniGCM(EncryptInfo, keyBuf, ivBuf);
    const data = querystring.parse(plaintext);

    // MapJson 是 JSON 字串（你截圖表格）
    const mapJsonStr = String(data.MapJson || "");
    let mapJson = null;
    try {
      mapJson = mapJsonStr ? JSON.parse(mapJsonStr) : null;
    } catch {
      mapJson = null;
    }

    const storeId = String(mapJson?.StoreID || "");
    const storeName = String(mapJson?.StoreName || "");
    const address = String(mapJson?.Address || "");
    const insularArea = String(mapJson?.InsularArea || "");
    const merKeyNo = String(data.MerKeyNo || req.query.merKeyNo || "");

    // ✅ 這裡我用「redirect 回 checkout」的方式把資料帶回前端
    // 你的 checkout.js 讀 query 後存 localStorage / state
    const redirectUrl =
      `${SITE_URL}/checkout` +
      `?cvs=1` +
      `&merKeyNo=${encodeURIComponent(merKeyNo)}` +
      `&storeId=${encodeURIComponent(storeId)}` +
      `&storeName=${encodeURIComponent(storeName)}` +
      `&address=${encodeURIComponent(address)}` +
      `&insularArea=${encodeURIComponent(insularArea)}`;

    return res.redirect(302, redirectUrl);
  } catch (e) {
    console.error("❌ cvs return error:", e);
    return res.status(500).send("Server Error");
  }
}
