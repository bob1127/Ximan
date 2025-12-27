// pages/api/payuni/cvs/return.js
import crypto from "crypto";
import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false, // ✅ 讓我們自己讀 raw body（避免 next 解析失敗）
  },
};

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

// ✅ 讀 raw body
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req, res) {
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

    // ✅ 讀 PayUni POST 回來的 form body
    const raw = await readRawBody(req);
    const form = Object.fromEntries(new URLSearchParams(raw));

    // ✅ Debug：一定要看到 PayUni 有沒有回 EncryptInfo/HashInfo
    console.log("✅ PayUni return raw:", raw?.slice(0, 500));
    console.log("✅ PayUni return parsed keys:", Object.keys(form));

    const recvMerID = form.MerID || form.MerId || form.merid;
    const EncryptInfo = form.EncryptInfo || form.encryptInfo || form.Encryptinfo;
    const HashInfo = form.HashInfo || form.hashInfo || form.Hashinfo;

    if (!EncryptInfo || !HashInfo) {
      console.warn("⚠️ PayUni return missing EncryptInfo/HashInfo", {
        recvMerID,
        hasEncrypt: !!EncryptInfo,
        hasHash: !!HashInfo,
      });
      return res.status(400).send("Missing EncryptInfo/HashInfo");
    }

    if (recvMerID && String(recvMerID) !== String(MerID)) {
      console.warn("⚠️ MerID mismatch", { recvMerID, MerID });
      return res.status(400).send("MerID mismatch");
    }

    // ✅ 驗 Hash
    const expectedHash = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);
    if (String(HashInfo).toUpperCase() !== expectedHash) {
      console.warn("⚠️ HashInfo mismatch", {
        got: String(HashInfo).toUpperCase(),
        expected: expectedHash,
      });
      return res.status(400).send("HashInfo mismatch");
    }

    // ✅ 解密
    const plaintext = decryptPayUniGCM(EncryptInfo, keyBuf, ivBuf);
    const data = querystring.parse(plaintext);

    console.log("✅ PayUni decrypted:", plaintext?.slice(0, 500));

    const mapJsonStr = String(data.MapJson || "");
    let mapJson = null;
    try {
      mapJson = mapJsonStr ? JSON.parse(mapJsonStr) : null;
    } catch (e) {
      console.warn("⚠️ MapJson JSON parse fail:", mapJsonStr?.slice(0, 200));
      mapJson = null;
    }

    const storeId = String(mapJson?.StoreID || "");
    const storeName = String(mapJson?.StoreName || "");
    const address = String(mapJson?.Address || "");
    const insularArea = String(mapJson?.InsularArea || "");
    const merKeyNo = String(data.MerKeyNo || req.query.merKeyNo || "");

    if (!storeId) {
      console.warn("⚠️ PayUni decrypted but no storeId", {
        merKeyNo,
        mapJson,
        keys: Object.keys(mapJson || {}),
      });
    }

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
