// pages/api/payuni/logistics/trade.js
import crypto from "crypto";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "querystring";

// === 跟你金流同一套：GCM Encrypt/Decrypt + SHA256 ===
function encryptPayUniGCM(plaintext, keyBuf, ivBuf) {
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuf, ivBuf);
  let cipherText = cipher.update(plaintext, "utf8", "base64");
  cipherText += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");
  return Buffer.from(`${cipherText}:::${tag}`).toString("hex").trim();
}

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
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { orderId } = req.body || {};
    if (!orderId) throw new Error("Missing orderId");

    // === env ===
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;
    const PAYUNI_LOGISTICS_TRADE_URL = process.env.PAYUNI_LOGISTICS_TRADE_URL;

    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!MerID || !HashKeyRaw || !HashIVRaw || !PAYUNI_LOGISTICS_TRADE_URL) {
      throw new Error("PayUni env missing (MerID/HashKey/HashIV/PAYUNI_LOGISTICS_TRADE_URL)");
    }
    if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      throw new Error("Woo env missing");
    }

    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    // === Woo 取訂單 & meta ===
    const api = new WooCommerceRestApi({
      url: WC_SITE_URL,
      consumerKey: WC_CONSUMER_KEY,
      consumerSecret: WC_CONSUMER_SECRET,
      version: "wc/v3",
    });

    const orderRes = await api.get(`orders/${encodeURIComponent(String(orderId))}`);
    const order = orderRes.data;
    const meta = Array.isArray(order.meta_data) ? order.meta_data : [];
    const getMeta = (k) => meta.find((m) => m?.key === k)?.value;

    // 防重複取號
    if (String(getMeta("_payuni_ship_created") || "0") === "1") {
      return res.status(200).json({ status: "ok", message: "already created" });
    }

    // 你在 create-order 時要先存這些（門市選擇後存進 meta）
    const storeId = String(getMeta("_cvs_store_id") || "");
    if (!storeId) throw new Error("Missing _cvs_store_id (7-11 門市未選)");

    const consignee = String(order?.shipping?.first_name || order?.billing?.first_name || "");
    const consigneeMobile = String(order?.billing?.phone || "");
    const consigneeMail = String(order?.billing?.email || "");

    // 金額：文件的 TradeAmt 等於訂單金額（如你截圖）
    const tradeAmt = Math.round(Number(order?.total || 0));
    if (!Number.isFinite(tradeAmt) || tradeAmt <= 0) {
      throw new Error(`Invalid order total: ${order?.total}`);
    }

    // === PAYUNi Logistics Trade (EncryptInfo 內容) ===
    // 依你截圖：LgsType = C2C-店到店，ShipType = 1=7-ELEVEN
    // GoodsType：1常溫 / 2冷凍（你目前常溫）
    // ServiceType：1=取貨付款 / 3=取貨不付款（你如果已線上付款就用 3）
    const encryptPayload = {
      MerID,
      Timestamp: Math.floor(Date.now() / 1000),
      MerTradeNo: String(order.id), // 你的商店訂單編號（長度限制請照文件）
      GoodsType: 1,
      LgsType: "C2C",
      ShipType: 1,
      TradeAmt: tradeAmt,
      ServiceType: 3, // ✅ 已用 PayUni 線上付款 -> 取貨不付款
      StoreID: storeId,
      Consignee: consignee,
      ConsigneeMobile: consigneeMobile,
      // 可填可不填：ConsigneeMail
      ...(consigneeMail ? { ConsigneeMail: consigneeMail } : {}),
      // 退貨門市、寄件人資訊等：看你是否要覆蓋後台設定
      // RefundStoreID: "...",
      // SenderName: "...",
      // SenderMobile: "..."
    };

    const plaintext = querystring.stringify(encryptPayload);
    const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

    const resp = await fetch(PAYUNI_LOGISTICS_TRADE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "payuni", // 你截圖有建議加 user-agent
      },
      body: JSON.stringify({
        MerID,
        Version: "1.2",
        EncryptInfo,
        HashInfo,
      }),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(`PayUni logistics trade HTTP ${resp.status}: ${JSON.stringify(json)}`);
    }

    // 回傳通常也是 EncryptInfo/HashInfo，這裡做驗證 & 解密
    const rEncrypt = json.EncryptInfo;
    const rHash = json.HashInfo;
    if (!rEncrypt || !rHash) {
      throw new Error(`PayUni response missing EncryptInfo/HashInfo: ${JSON.stringify(json)}`);
    }

    const expected = sha256PayUni(rEncrypt, HashKeyRaw, ivBuf);
    if (String(rHash).toUpperCase() !== expected) {
      throw new Error("PayUni logistics response HashInfo mismatch");
    }

    const rPlain = decryptPayUniGCM(rEncrypt, keyBuf, ivBuf);
    const rData = querystring.parse(rPlain);

    // 你截圖的回傳欄位裡有：
    // TradeNo(UNi序號), ShipTradeNo(UNi物流序號), Odno(出貨單號), StoreName/StoreAddr...等
    const shipTradeNo = String(rData.ShipTradeNo || "");
    const odno = String(rData.Odno || "");
    const tradeNo = String(rData.TradeNo || "");
    const status = String(rData.Status || json.Status || "");

    // 存回 Woo meta
    await api.put(`orders/${encodeURIComponent(String(orderId))}`, {
      meta_data: [
        { key: "_payuni_ship_created", value: "1" },
        { key: "_payuni_ship_status", value: status },
        { key: "_payuni_ship_trade_no", value: shipTradeNo },
        { key: "_payuni_ship_odno", value: odno },
        { key: "_payuni_trade_no", value: tradeNo },
        { key: "_payuni_ship_raw", value: JSON.stringify({ json, rData }) },
      ],
    });

    return res.status(200).json({
      status: "success",
      payuniStatus: status,
      shipTradeNo,
      odno,
      tradeNo,
      rData,
    });
  } catch (e) {
    console.error("❌ logistics/trade error:", e);
    return res.status(500).json({ status: "error", message: e?.message || "server error" });
  }
}
