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

  // ✅ 門市地圖 URL（照你的文件 #/7/103）
  const SHIP_MAP_URL =
    process.env.PAYUNI_SHIP_MAP_URL ||
    "https://sandbox-api.payuni.com.tw/api/logistics/ship_map";

  if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL) {
    return res.status(500).send("PayUni env missing");
  }

  const keyBuf = Buffer.from(HashKeyRaw, "utf8");
  const ivBuf = Buffer.from(HashIVRaw, "utf8");

  // 你可以從 query 決定常溫/冷凍、B2C/C2C… 先給預設常溫+7-11
  const goodsType = Number(req.query.goodsType || 1); // 1常溫 2冷凍
  const lgsType = String(req.query.lgsType || "C2C"); // C2C 店到店
  const shipType = Number(req.query.shipType || 1);   // 1=7-ELEVEN
  const mapType = Number(req.query.mapType || 1);     // 1=僅限本島 2=本島+離島

  // MerKeyNo：文件說「自訂編號」，你可用時間戳
  const merKeyNo = String(req.query.merKeyNo || `MAP_${Date.now()}`);

  // MapReturnURL：PayUni 選完門市回來打這支（POST）
  // 我這裡把 returnUrl 做成你的 /api/payuni/cvs/return
  // 並把 merKeyNo 帶回去，方便你前端識別是哪次選門市
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
    MapReturnURL: mapReturnURL, // C：可選，但你要接回門市一定要填
  };

  const plaintext = querystring.stringify(encryptPayload);
  const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
  const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

  // PayUni 是 Form Post：回 HTML 自動送出
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
