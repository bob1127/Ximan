// pages/api/payuni/cvs-map.js
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
  return crypto.createHash("sha256")
    .update(`${keyRaw}${encryptStr}${ivBuf.toString()}`)
    .digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  const MerID = process.env.PAYUNI_MERCHANT_ID;
  const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
  const HashIVRaw = process.env.PAYUNI_HASH_IV;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  // 你要在 env 放一個「電子地圖入口」
  const PAYUNI_CVS_MAP_URL = process.env.PAYUNI_CVS_MAP_URL;

  const keyBuf = Buffer.from(HashKeyRaw, "utf8");
  const ivBuf = Buffer.from(HashIVRaw, "utf8");

  // TODO: 依 PAYUNi 電子地圖文件填必要欄位
  const payload = {
    MerID,
    Timestamp: Math.floor(Date.now() / 1000),
    // ReturnURL / NotifyURL 依文件
    ReturnURL: `${SITE_URL}/api/payuni/cvs-return`,
    // ...其餘欄位（例如選 7-11 / b2c / c2c / 溫層...）
  };

  const plaintext = querystring.stringify(payload);
  const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
  const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`
<!doctype html><html><body>
  <form id="f" method="POST" action="${PAYUNI_CVS_MAP_URL}">
    <input type="hidden" name="MerID" value="${MerID}" />
    <input type="hidden" name="EncryptInfo" value="${EncryptInfo}" />
    <input type="hidden" name="HashInfo" value="${HashInfo}" />
    <input type="hidden" name="Version" value="1.0" />
  </form>
  <script>document.getElementById('f').submit()</script>
</body></html>`);
}
