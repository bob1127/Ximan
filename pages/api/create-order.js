// pages/api/create-order.js
import crypto from "crypto";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "querystring";

// AES-256-GCM 加密（官方格式：hex( base64(cipher) + ':::' + base64(tag) )）
function encryptPayUniGCM(plaintext, key, ivBuf) {
  const cipher = crypto.createCipheriv("aes-256-gcm", key, ivBuf);

  let cipherText = cipher.update(plaintext, "utf8", "base64");
  cipherText += cipher.final("base64");

  const tag = cipher.getAuthTag().toString("base64");
  return Buffer.from(`${cipherText}:::${tag}`).toString("hex").trim();
}

// SHA256（官方格式：SHA256(key + encryptStr + iv)）
function sha256PayUni(encryptStr, key, ivBuf) {
  const hash = crypto.createHash("sha256").update(`${key}${encryptStr}${ivBuf.toString()}`);
  return hash.digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { cartItems, customer } = req.body || {};

    // ===== env =====
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKey = process.env.PAYUNI_HASH_KEY; // 32字元
    const HashIV = process.env.PAYUNI_HASH_IV;   // 16字元（官方範例）
    const PAYUNI_BASE_URL = process.env.PAYUNI_BASE_URL; // https://api.payuni.com.tw/api/upp
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!MerID || !HashKey || !HashIV || !PAYUNI_BASE_URL || !SITE_URL) {
      throw new Error("環境變數缺失（PAYUNI_MERCHANT_ID/PAYUNI_HASH_KEY/PAYUNI_HASH_IV/PAYUNI_BASE_URL/NEXT_PUBLIC_SITE_URL）");
    }
    if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      throw new Error("WooCommerce 環境變數缺失（WC_SITE_URL/WC_CONSUMER_KEY/WC_CONSUMER_SECRET）");
    }

    // ✅ 官方範例：iv 必須是 Buffer
    const ivBuf = Buffer.from(HashIV);

    // ===== 1) 建 Woo 訂單 =====
    const api = new WooCommerceRestApi({
      url: WC_SITE_URL,
      consumerKey: WC_CONSUMER_KEY,
      consumerSecret: WC_CONSUMER_SECRET,
      version: "wc/v3",
    });

    const wooResponse = await api.post("orders", {
      payment_method: "payuni",
      payment_method_title: "PayUni 統一支付",
      billing: {
        first_name: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address_1: customer?.address || "",
        city: customer?.city || "",
        postcode: customer?.postalCode || "",
      },
      line_items: (cartItems || []).map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    });

    const wooOrder = wooResponse.data;
    const orderNo = String(wooOrder.id);
    const amt = Math.round(Number(wooOrder.total || 0));
    if (!Number.isFinite(amt) || amt <= 0) {
      throw new Error(`訂單金額不正確：wooOrder.total=${wooOrder.total}`);
    }

    // ===== 2) 依官方 UPP 欄位（你要用文件的正確欄位名）=====
    // 你前面截圖用的是 MerTradeNo / TradeAmt / ProdDesc / UsrMail / ReturnURL / Timestamp
    const payload = {
      MerID,
      MerTradeNo: orderNo,
      TradeAmt: amt,
      Timestamp: Math.floor(Date.now() / 1000),
      ProdDesc: `Order${orderNo}`,
      UsrMail: customer?.email || "",
      ReturnURL: `${SITE_URL}/api/payuni/return`,
      // NotifyURL: `${SITE_URL}/api/payuni/notify`, // 若文件有要求再打開
      // BackURL: `${SITE_URL}/checkout/success`,    // 若文件有要求再打開
    };

    // ✅ 官方作法：querystring.stringify（會做 URL encode）
    const plaintext = querystring.stringify(payload);

    // ===== 3) EncryptInfo / HashInfo（照官方）=====
    const EncryptInfo = encryptPayUniGCM(plaintext, HashKey, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKey, ivBuf);

    const paymentUrl = PAYUNI_BASE_URL.replace(/\/$/, ""); // ✅ POST 到 /api/upp

    console.log("=== PayUni UPP Official Debug ===");
    console.log("paymentUrl:", paymentUrl);
    console.log("orderNo:", orderNo);
    console.log("amt:", amt);
    console.log("plaintext:", plaintext);
    console.log("EncryptInfo(head):", EncryptInfo.slice(0, 60) + "...");
    console.log("HashInfo:", HashInfo);

    return res.status(200).json({
      status: "success",
      paymentUrl,
      MerID,
      EncryptInfo,
      HashInfo,
      Version: "1.0",
      orderId: wooOrder.id,
      amount: amt,
    });
  } catch (error) {
    console.error("❌ PayUni Error:", error);
    return res.status(500).json({ status: "error", message: error?.message || "Server error" });
  }
}
