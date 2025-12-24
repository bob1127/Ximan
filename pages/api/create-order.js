// pages/api/create-order.js
import crypto from "crypto";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "querystring";

// AES-256-GCM 加密：hex( base64(cipher) + ':::' + base64(tag) )
function encryptPayUniGCM(plaintext, keyBuf, ivBuf) {
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuf, ivBuf);

  let cipherText = cipher.update(plaintext, "utf8", "base64");
  cipherText += cipher.final("base64");

  const tag = cipher.getAuthTag().toString("base64");
  return Buffer.from(`${cipherText}:::${tag}`).toString("hex").trim();
}

// SHA256：SHA256(key + encryptStr + iv)
function sha256PayUni(encryptStr, keyRaw, ivBuf) {
  const hash = crypto
    .createHash("sha256")
    .update(`${keyRaw}${encryptStr}${ivBuf.toString()}`);
  return hash.digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { cartItems, customer } = req.body || {};

    // ===== env =====
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY; // 32字元
    const HashIVRaw = process.env.PAYUNI_HASH_IV; // 16字元
    const PAYUNI_BASE_URL = process.env.PAYUNI_BASE_URL; // https://api.payuni.com.tw/api/upp
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!MerID || !HashKeyRaw || !HashIVRaw || !PAYUNI_BASE_URL || !SITE_URL) {
      throw new Error(
        "環境變數缺失（PAYUNI_MERCHANT_ID/PAYUNI_HASH_KEY/PAYUNI_HASH_IV/PAYUNI_BASE_URL/NEXT_PUBLIC_SITE_URL）"
      );
    }
    if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      throw new Error(
        "WooCommerce 環境變數缺失（WC_SITE_URL/WC_CONSUMER_KEY/WC_CONSUMER_SECRET）"
      );
    }

    // Buffer（更嚴謹）
    const keyBuf = Buffer.from(HashKeyRaw, "utf8"); // AES key 32 bytes
    const ivBuf = Buffer.from(HashIVRaw, "utf8"); // IV 16 bytes

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
      set_paid: false, // ✅ 初始不要設已付款，等 notify 成功才更新狀態
      billing: {
        first_name: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address_1: customer?.address || "",
        city: customer?.city || "",
        postcode: customer?.postalCode || "",
      },
      line_items: (cartItems || []).map((item) => ({
        product_id: item.id, // ⚠️ 請確保這是 Woo 的 product_id
        quantity: item.quantity,
      })),
    });

    const wooOrder = wooResponse.data;
    const orderNo = String(wooOrder.id);

    // ✅ 金額以 Woo total 為準（最安全）
    const amt = Math.round(Number(wooOrder.total || 0));
    if (!Number.isFinite(amt) || amt <= 0) {
      throw new Error(`訂單金額不正確：wooOrder.total=${wooOrder.total}`);
    }

    // ===== 2) PayUni UPP payload =====
    const payload = {
      MerID,
      MerTradeNo: orderNo,
      TradeAmt: amt,
      Timestamp: Math.floor(Date.now() / 1000),
      ProdDesc: `Order${orderNo}`,
      UsrMail: customer?.email || "",
      ReturnURL: `${SITE_URL}/api/payuni/return`,
      NotifyURL: `${SITE_URL}/api/payuni/notify`, // ✅ 打開 Notify（付款成功會打回來）
      BackURL: `${SITE_URL}/order-lookup`, // ✅ 可選：付款完成回到哪（你可改成成功頁）
    };

    const plaintext = querystring.stringify(payload);

    // ===== 3) EncryptInfo / HashInfo =====
    const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

    const paymentUrl = PAYUNI_BASE_URL.replace(/\/$/, "");

    console.log("=== PayUni UPP Debug ===");
    console.log("orderNo:", orderNo, "amt:", amt);
    console.log("NotifyURL:", payload.NotifyURL);
    console.log("ReturnURL:", payload.ReturnURL);

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
    console.error("❌ create-order error:", error);
    return res
      .status(500)
      .json({ status: "error", message: error?.message || "Server error" });
  }
}
