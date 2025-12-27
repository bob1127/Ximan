// pages/api/payuni/cvs/return.js
import crypto from "crypto";
import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false, // ✅ 我們自己解析，避免拿到空 body
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
  // ✅ 用 utf8，避免 Buffer.toString() 亂出
  return crypto
    .createHash("sha256")
    .update(`${keyRaw}${encryptStr}${ivBuf.toString("utf8")}`)
    .digest("hex")
    .toUpperCase();
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  }
  return "";
}

export default async function handler(req, res) {
  // PayUni 回傳通常是 POST
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const SITE_URL =
    (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") ||
    "http://localhost:3000";

  try {
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;

    if (!MerID || !HashKeyRaw || !HashIVRaw) {
      throw new Error("PayUni env missing");
    }

    // ⚠️ 先維持 utf8；若你確認 key/iv 是 hex，再改成 Buffer.from(x,'hex')
    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    // ✅ 解析 raw body（form 或 json）
    const raw = await readRawBody(req);
    const contentType = String(req.headers["content-type"] || "");

    let body = {};
    if (contentType.includes("application/x-www-form-urlencoded")) {
      body = Object.fromEntries(new URLSearchParams(raw));
    } else if (contentType.includes("application/json")) {
      body = raw ? JSON.parse(raw) : {};
    } else {
      // fallback：先嘗試 form
      body = Object.fromEntries(new URLSearchParams(raw));
      if (Object.keys(body).length === 0) {
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          body = {};
        }
      }
    }

    const recvMerID = pick(body, ["MerID", "MerId", "merid", "merID"]);
    const EncryptInfo = pick(body, ["EncryptInfo", "encryptInfo", "Encryptinfo"]);
    const HashInfo = pick(body, ["HashInfo", "hashInfo", "Hashinfo"]);

    if (!EncryptInfo || !HashInfo) {
      console.log("⚠️ PayUni return missing Encrypt/Hash", {
        contentType,
        rawPreview: String(raw || "").slice(0, 500),
        bodyKeys: Object.keys(body || {}),
      });
      return res.status(400).send("Missing EncryptInfo/HashInfo");
    }

    if (recvMerID && String(recvMerID) !== String(MerID)) {
      return res.status(400).send("MerID mismatch");
    }

    // ✅ 驗 Hash
    const expectedHash = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);
    if (String(HashInfo).toUpperCase() !== expectedHash) {
      console.log("❌ Hash mismatch", {
        got: String(HashInfo).slice(0, 12) + "...",
        expected: String(expectedHash).slice(0, 12) + "...",
      });
      return res.status(400).send("HashInfo mismatch");
    }

    // ✅ 解密
    const plaintext = decryptPayUniGCM(EncryptInfo, keyBuf, ivBuf);
    const data = querystring.parse(plaintext);

    // ✅ MapJson 是 JSON 字串（多數情況）
    const mapJsonStr = String(pick(data, ["MapJson", "mapJson"]) || "");
    let mapJson = null;
    try {
      mapJson = mapJsonStr ? JSON.parse(mapJsonStr) : null;
    } catch {
      mapJson = null;
    }

    // ✅ 兼容多種 key
    const storeId = String(
      pick(mapJson, ["StoreID", "StoreId", "storeId", "CVSStoreID", "StoreNo"]) || ""
    );
    const storeName = String(
      pick(mapJson, ["StoreName", "storeName", "CVSStoreName"]) || ""
    );
    const address = String(
      pick(mapJson, ["StoreAddr", "Address", "address", "StoreAddress"]) || ""
    );
    const insularArea = String(
      pick(mapJson, ["InsularArea", "insularArea", "IsOutlying", "Outlying"]) || ""
    );

    const merKeyNo = String(pick(data, ["MerKeyNo", "merKeyNo"]) || req.query.merKeyNo || "");

    // ✅ 若拿不到門市資料：印出 plaintext/MapJson 片段，讓你對欄位
    if (!storeId) {
      console.log("⚠️ PayUni return decrypted but no storeId", {
        merKeyNo,
        plaintextPreview: String(plaintext).slice(0, 800),
        mapJsonPreview: String(mapJsonStr).slice(0, 800),
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

    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (e) {
    console.error("❌ cvs return error:", e);
    return res.status(500).send("Server Error");
  }
}
