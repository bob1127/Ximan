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

// ✅ 運費規則（你要：HOME=80、CVS_711=1）
function calcShipping(customer) {
  const method = customer?.shippingMethod || "HOME";

  if (method === "HOME") {
    return { fee: 80, method_id: "flat_rate", method_title: "宅配(單一費率)" };
  }
  if (method === "CVS_711") {
    return { fee: 1, method_id: "flat_rate", method_title: "7-11 店到店" };
  }
  return { fee: 80, method_id: "flat_rate", method_title: "運送" };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { cartItems, customer } = req.body || {};
    const ship = calcShipping(customer);

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
      set_paid: false,

      billing: {
        first_name: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address_1: customer?.address || "",
        city: customer?.city || "",
        postcode: customer?.postalCode || "",
        country: "TW", // ✅ 建議固定 TW，避免 Woo 判區出錯
      },

      shipping: {
        first_name: customer?.name || "",
        address_1: customer?.address || "",
        city: customer?.city || "",
        postcode: customer?.postalCode || "",
        country: "TW",
      },

      line_items: (cartItems || []).map((item) => ({
        product_id: item.id, // ⚠️ 請確保這是 Woo 的 product_id
        quantity: item.quantity,
      })),

      // ✅ 關鍵：把運費寫入 Woo 訂單
      shipping_lines: [
        {
          method_id: ship.method_id, // flat_rate
          method_title: ship.method_title,
          total: String(ship.fee), // "80" or "1"
        },
      ],

      // ✅（建議）把運送方式 & 門市資訊存 meta，後台好查
      meta_data: [
        { key: "shipping_method", value: customer?.shippingMethod || "HOME" },
        ...(customer?.shippingMethod === "CVS_711" && customer?.cvs?.storeId
          ? [
              { key: "cvs_store_id", value: customer.cvs.storeId },
              { key: "cvs_store_name", value: customer.cvs.storeName },
              { key: "cvs_store_address", value: customer.cvs.address },
              { key: "cvs_store_insular_area", value: customer.cvs.insularArea || "" },
            ]
          : []),
      ],
    });

    const wooOrder = wooResponse.data;
    const orderNo = String(wooOrder.id);

    // ✅ 金額以 Woo total 為準（含運費）
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
      NotifyURL: `${SITE_URL}/api/payuni/notify`,
      BackURL: `${SITE_URL}/order-lookup`,
      PaymentType: "CREDIT,ATM,CVS",
    };

    const plaintext = querystring.stringify(payload);

    // ===== 3) EncryptInfo / HashInfo =====
    const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

    const paymentUrl = PAYUNI_BASE_URL.replace(/\/$/, "");

    console.log("=== PayUni UPP Debug ===");
    console.log("orderNo:", orderNo, "amt:", amt);
    console.log("shipping:", ship);
    console.log("NotifyURL:", payload.NotifyURL);
    console.log("ReturnURL:", payload.ReturnURL);

    // ===== 4) ✅ 下單成功信（待付款）=====
    fetch(`${SITE_URL}/api/send-order-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: wooOrder.id, type: "ORDER_CREATED" }),
    }).catch((e) => console.error("send ORDER_CREATED email failed:", e));

    return res.status(200).json({
      status: "success",
      paymentUrl,
      MerID,
      EncryptInfo,
      HashInfo,
      Version: "1.0",
      orderId: wooOrder.id,
      amount: amt,

      // ✅ 前端顯示可用（以後端為準）
      shippingFee: ship.fee,
      shippingTitle: ship.method_title,
      wooTotal: Number(wooOrder.total || 0),
      wooShippingTotal: Number(wooOrder.shipping_total || ship.fee),
    });
  } catch (error) {
    console.error("❌ create-order error:", error);
    return res
      .status(500)
      .json({ status: "error", message: error?.message || "Server error" });
  }
}
