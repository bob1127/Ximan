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
    .update(`${keyRaw}${encryptStr}${ivBuf.toString()}`)
    .digest("hex")
    .toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  const MerID = process.env.PAYUNI_MERCHANT_ID;
  const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
  const HashIVRaw = process.env.PAYUNI_HASH_IV;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  // ✅ 正式/測試門市地圖 URL（照文件）
  const SHIP_MAP_URL =
    process.env.PAYUNI_SHIP_MAP_URL ||
    "https://sandbox-api.payuni.com.tw/api/logistics/ship_map";

  if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL) {
    return res.status(500).send("PayUni env missing");
  }

  const keyBuf = Buffer.from(HashKeyRaw, "utf8");
  const ivBuf = Buffer.from(HashIVRaw, "utf8");

  const goodsType = Number(req.query.goodsType || 1); // 1常溫 2冷凍
  const lgsType = String(req.query.lgsType || "C2C"); // C2C 店到店 / B2C 大宗寄倉
  const shipType = Number(req.query.shipType || 1);   // 1=7-ELEVEN
  const mapType = Number(req.query.mapType || 1);     // 1=僅限本島 2=含離島

  // ✅ 文件：MerKeyNo 限制長度 20
  const baseKey = String(req.query.merKeyNo || `MAP_${Date.now()}`);
  const merKeyNo = baseKey.slice(0, 20);

  // ✅ 回傳 URL：PayUni 會 POST 回這支
  const mapReturnURL = `${SITE_URL}/api/payuni/cvs/return?merKeyNo=${encodeURIComponent(
    merKeyNo
  )}`;

  // ✅ 文件：Tag 必填
  // Tag=2 => 回傳選取的門市資訊（MapJson）
  const Tag = 2;

  // ✅ MobileTag（選填）：N=PC / Y=手機
  // 你也可以依 UA 判斷；先用 query 控制，預設 N
  const MobileTag = String(req.query.mobileTag || "N").toUpperCase() === "Y" ? "Y" : "N";

  const encryptPayload = {
    MerID,
    Timestamp: Math.floor(Date.now() / 1000),
    MerKeyNo: merKeyNo,
    GoodsType: goodsType,
    LgsType: lgsType,
    ShipType: shipType,
    MapType: goodsType === 2 ? 2 : mapType, // 文件：冷凍 GoodsType=2 => MapType 固定 2
    MapReturnURL: mapReturnURL,
    Tag, // ✅ 必填
    MobileTag, // ✅ 選填
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
