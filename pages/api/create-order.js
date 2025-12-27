// pages/api/create-order.js
import crypto from "crypto";

function getKeyBuffer(keyStr) {
  // PayUni 常見：HashKey 32字元(utf8) / 64字元(hex)
  if (!keyStr) throw new Error("PAYUNI_HASH_KEY 缺失");
  if (keyStr.length === 64) return Buffer.from(keyStr, "hex");
  return Buffer.from(keyStr, "utf8");
}

function getIvBuffer(ivStr) {
  // PayUni 常見：HashIV 16字元(utf8) / 32字元(hex)
  if (!ivStr) throw new Error("PAYUNI_HASH_IV 缺失");
  if (ivStr.length === 32) return Buffer.from(ivStr, "hex");
  return Buffer.from(ivStr, "utf8");
}

function encryptPayUni(rawQueryString, keyStr, ivStr) {
  const key = getKeyBuffer(keyStr);
  const iv = getIvBuffer(ivStr);

  if (key.length !== 32) {
    throw new Error(`PAYUNI_HASH_KEY 長度不正確，必須是 32 bytes，目前 ${key.length}`);
  }
  if (iv.length !== 16) {
    throw new Error(`PAYUNI_HASH_IV 長度不正確，必須是 16 bytes，目前 ${iv.length}`);
  }

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(rawQueryString, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function sha256Hash(str) {
  return crypto.createHash("sha256").update(str).digest("hex").toUpperCase();
}

// --- Woo helper ---
async function wooRequest(path, method = "GET", body = null) {
  const base = process.env.WC_API_URL; // e.g. https://xxx.com
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  if (!base || !ck || !cs) {
    throw new Error("Woo 環境變數缺失：WC_API_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET");
  }

  const url = new URL(`${base.replace(/\/$/, "")}/wp-json/wc/v3/${path.replace(/^\//, "")}`);
  url.searchParams.set("consumer_key", ck);
  url.searchParams.set("consumer_secret", cs);

  const res = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.message || `Woo API Error: ${res.status}`;
    throw new Error(msg);
  }
  return json;
}
function calcShipping(customer) {
  // 目前規則：
  // - 宅配 HOME：NT$80
  // - 7-11 店到店 CVS_711：NT$80
  // - 對應 Woo：台灣地區 → 單一費率 flat_rate

  const method = customer?.shippingMethod || "HOME";

  return {
    fee: 80,
    method_id: "flat_rate",
    method_title:
      method === "CVS_711"
        ? "7-11 店到店"
        : "宅配（單一費率）",
  };
}


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { cartItems, customer } = req.body || {};
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ status: "error", message: "cartItems 不可為空" });
    }
    if (!customer?.email) {
      return res.status(400).json({ status: "error", message: "customer.email 必填" });
    }

    // 1) 計算商品小計
    const subtotal = cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);

    // 2) 運費（後端權威）
    const shipping = calcShipping(customer);
    const totalAmount = subtotal + Number(shipping.fee || 0);

    // 3) ✅ 建立 Woo 訂單（把 shipping_lines 塞進去）
    // 你前端 cartItems 結構不一定有 Woo product_id
    // 若你 item.id 是 Woo product id，下面就能直接用。
    // 若不是，你要在這裡做 mapping（用 SKU / slug 去查 product）
    const line_items = cartItems.map((item) => ({
      product_id: Number(item.id), // ✅ 假設 item.id 就是 Woo product id
      quantity: Number(item.quantity) || 1,
    }));

    const shipping_address = {
      first_name: customer?.name || "",
      last_name: "",
      address_1: customer?.address || "",
      address_2: "",
      city: customer?.city || "",
      state: "", // 台灣可留空或放區
      postcode: customer?.postalCode || "",
      country: "TW",
      phone: customer?.phone || "",
    };

    const billing_address = {
      ...shipping_address,
      email: customer?.email || "",
    };

    const orderPayload = {
      payment_method: "payuni", // 你自己定義（不影響）
      payment_method_title: "PayUni",
      set_paid: false,
      billing: billing_address,
      shipping: shipping_address,
      line_items,
      shipping_lines: [
        {
          method_id: shipping.method_id,
          method_title: shipping.method_title,
          total: String(shipping.fee), // Woo 要字串
        },
      ],
      meta_data: [
        {
          key: "shipping_method_custom",
          value: customer?.shippingMethod || "HOME",
        },
        {
          key: "payuni_cvs_store",
          value: customer?.cvs ? JSON.stringify(customer.cvs) : "",
        },
      ],
      // ✅ 如果你 Woo 後台貨幣還是 USD，這裡也可以強制寫 TWD（但最好去 Woo 後台改）
      currency: "TWD",
    };

    const wooOrder = await wooRequest("orders", "POST", orderPayload);
    const orderId = String(wooOrder?.id || `Order_${Date.now()}`);

    // 4) PayUni 參數
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKey = process.env.PAYUNI_HASH_KEY;
    const HashIV = process.env.PAYUNI_HASH_IV;
    const PAYUNI_URL = process.env.PAYUNI_BASE_URL;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!MerID || !HashKey || !HashIV || !PAYUNI_URL) {
      throw new Error("PayUni 環境變數缺失：PAYUNI_MERCHANT_ID / PAYUNI_HASH_KEY / PAYUNI_HASH_IV / PAYUNI_BASE_URL");
    }

    // PayUni 訂單編號：建議你用 Woo 訂單 id（更好對帳）
    const MerOrderNo = `WC${orderId}`;

    const tradeParams = {
      MerID,
      MerOrderNo,
      Amt: totalAmount, // ✅ 含運費
      ItemName: `CIEMAN Store Order - ${MerOrderNo}`,
      ReturnURL: `${SITE_URL}/api/payment-return`,
      NotifyURL: `${SITE_URL}/api/payment-notify`,
      BackURL: `${SITE_URL}/checkout/success`,
      UsrMail: customer.email,
      Timestamp: Math.floor(Date.now() / 1000),
    };

    // 5) 加密
    const rawString = Object.keys(tradeParams)
      .map((k) => `${k}=${encodeURIComponent(tradeParams[k])}`)
      .join("&");

    const EncryptInfo = encryptPayUni(rawString, HashKey, HashIV);
    const HashInfo = sha256Hash(HashKey + EncryptInfo + HashIV);

    // 6) 回給前端（✅ 對齊你 checkout.js 期待的欄位）
    return res.status(200).json({
      status: "success",
      paymentUrl: PAYUNI_URL,

      // ✅ 你的 checkout.js 用的欄位名
      MerID,
      EncryptInfo,
      HashInfo,
      Version: "1.0",

      // ✅ 保留相容（你舊版回傳名）
      MerchantID: MerID,
      TradeInfo: EncryptInfo,
      TradeSha: HashInfo,

      // ✅ 額外回傳讓前端可以顯示
      wooOrderId: orderId,
      subtotal,
      shippingFee: shipping.fee,
      totalAmount,
    });
  } catch (error) {
    console.error("❌ create-order error:", error);
    return res.status(500).json({ status: "error", message: error.message || "Server error" });
  }
}
