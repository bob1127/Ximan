// pages/api/payuni/cvs/map.js
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

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  const MerID = process.env.PAYUNI_MERCHANT_ID;
  const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
  const HashIVRaw = process.env.PAYUNI_HASH_IV;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  // ✅ 統一只用這個 env，不要 fallback sandbox
  const SHIP_MAP_URL = process.env.PAYUNI_SHIP_MAP_URL;

  if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL || !SHIP_MAP_URL) {
    return res
      .status(500)
      .send(
        "PayUni env missing: PAYUNI_MERCHANT_ID/PAYUNI_HASH_KEY/PAYUNI_HASH_IV/NEXT_PUBLIC_SITE_URL/PAYUNI_SHIP_MAP_URL"
      );
  }

  // ⚠️ 先維持 utf8（若 key/iv 是 hex，再改成 Buffer.from(x,'hex')）
  const keyBuf = Buffer.from(HashKeyRaw, "utf8");
  const ivBuf = Buffer.from(HashIVRaw, "utf8");

  const goodsType = Number(req.query.goodsType || 1);
  const lgsType = String(req.query.lgsType || "C2C");
  const shipType = Number(req.query.shipType || 1);
  const mapType = Number(req.query.mapType || 1);
  const merKeyNo = String(req.query.merKeyNo || `MAP_${Date.now()}`);

  const mapReturnURL = `${SITE_URL}/api/payuni/cvs/return?merKeyNo=${encodeURIComponent(
    merKeyNo
  )}`;

  const encryptPayload = {
    MerID,
    Timestamp: Math.floor(Date.now() / 1000),
    MerKeyNo: merKeyNo,
    GoodsType: goodsType,
    LgsType: lgsType,
    ShipType: shipType,
    MapType: mapType,
    MapReturnURL: mapReturnURL,
  };

  const plaintext = querystring.stringify(encryptPayload);
  const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
  const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(`
<!doctype html>
<html>
  <body>
    <form id="f" method="post" action="${SHIP_MAP_URL}">
      <input type="hidden" name="MerID" value="${MerID}" />
      <input type="hidden" name="Version" value="1.1" />
      <input type="hidden" name="EncryptInfo" value="${EncryptInfo}" />
      <input type="hidden" name="HashInfo" value="${HashInfo}" />
    </form>
    <script>document.getElementById('f').submit();</script>
  </body>
</html>
  `);
}
