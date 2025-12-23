import crypto from "crypto";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// AES-256-CBC 加密（PayUni TradeInfo）
function encryptPayUni(raw, key, iv) {
  const keyBuf = Buffer.from(key, "utf8");
  const ivBuf = Buffer.from(iv, "utf8");

  // AES-256-CBC: key 32 bytes, iv 16 bytes
  if (keyBuf.length !== 32 || ivBuf.length !== 16) {
    throw new Error(
      `PAYUNI_HASH_KEY / PAYUNI_HASH_IV 長度錯誤：key=${keyBuf.length}, iv=${ivBuf.length}`
    );
  }

  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuf, ivBuf);
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(raw, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function sha256Upper(str) {
  return crypto.createHash("sha256").update(str).digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { cartItems, customer } = req.body;

    // ====== 讀取環境變數 ======
    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKey = process.env.PAYUNI_HASH_KEY;
    const HashIV = process.env.PAYUNI_HASH_IV;

    // 建議 PAYUNI_BASE_URL 放 https://api.payuni.com.tw/api/upp （不要含 /payment）
    const PAYUNI_BASE_URL = process.env.PAYUNI_BASE_URL;

    // 你的站台公開網址（Vercel/正式域名；本機請用 ngrok/tunnel）
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      throw new Error("WooCommerce 環境變數缺失（WC_SITE_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET）");
    }
    if (!MerID || !HashKey || !HashIV || !PAYUNI_BASE_URL || !SITE_URL) {
      throw new Error("PayUni/站台 環境變數缺失（MerID/HashKey/HashIV/PAYUNI_BASE_URL/NEXT_PUBLIC_SITE_URL）");
    }

    // ====== 1) 建立 WooCommerce 訂單 ======
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

    // Woo total 可能是字串，用 Number 轉
    const amt = Math.round(Number(wooOrder.total || 0));
    if (!amt || amt <= 0) {
      throw new Error(`訂單金額不正確：wooOrder.total=${wooOrder.total}`);
    }

    // ====== 2) PayUni 參數 ======
    const tradeParams = {
      Amt: amt,
      BackURL: `${SITE_URL}/checkout/success`,
      ItemName: `Order${orderNo}`,
      MerID: MerID,
      MerOrderNo: orderNo,
      NotifyURL: `${SITE_URL}/api/payment-notify`, // 背景通知
      ReturnURL: `${SITE_URL}/api/payment-return`, // 同步/回傳
      Timestamp: Math.floor(Date.now() / 1000),
      UsrMail: customer.email,
    };

    // A-Z 排序 + encode
    const rawString = Object.keys(tradeParams)
      .sort()
      .map((k) => `${k}=${encodeURIComponent(tradeParams[k])}`)
      .join("&");

    // ====== 3) 產生 TradeInfo / TradeSha ======
    const TradeInfo = encryptPayUni(rawString, HashKey, HashIV);

    // 常見正確驗章格式（帶欄位名）
    const shaStr = `HashKey=${HashKey}&TradeInfo=${TradeInfo}&HashIV=${HashIV}`;
    const TradeSha = sha256Upper(shaStr);

    // 付款網址（一定要 /payment）
    const paymentUrl = `${PAYUNI_BASE_URL.replace(/\/$/, "")}/payment`;

    console.log("=== PayUni Create Order Debug ===");
    console.log("paymentUrl:", paymentUrl);
    console.log("rawString:", rawString);
    console.log("TradeSha:", TradeSha);

    // ====== 4) 回傳給前端 ======
    return res.status(200).json({
      status: "success",
      paymentUrl,
      MerID,
      TradeInfo,
      TradeSha,
      Version: "1.0",
      orderId: wooOrder.id,
      amount: amt,
    });
  } catch (error) {
    console.error("❌ PayUni Error:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Server error",
    });
  }
}
