import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import crypto from "crypto";

// 初始化 WooCommerce
const api = new WooCommerceRestApi({
  url: process.env.WC_SITE_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL, // 增加容錯
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

// 加密函式
function encryptNewebPay(data) {
  const key = process.env.NEWEBPAY_HASH_KEY;
  const iv = process.env.NEWEBPAY_HASH_IV;
  const params = new URLSearchParams(data).toString();
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(params, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// 壓碼函式
function hashNewebPay(aesString) {
  const key = process.env.NEWEBPAY_HASH_KEY;
  const iv = process.env.NEWEBPAY_HASH_IV;
  const raw = `HashKey=${key}&${aesString}&HashIV=${iv}`;
  return crypto.createHash("sha256").update(raw).digest("hex").toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("🚀 [DEBUG] 開始建立訂單...");
    
    // 1. 檢查環境變數是否讀取成功 (除錯 500 錯誤用)
    if (!process.env.WC_CONSUMER_KEY || !process.env.NEWEBPAY_MERCHANT_ID) {
      console.error("❌ [ERROR] 環境變數缺失！請檢查 .env.local");
      throw new Error("伺服器配置錯誤：環境變數遺失");
    }

    const { cartItems, customer } = req.body;

    // 2. 建立 WooCommerce 訂單
    const lineItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      payment_method: "newebpay",
      payment_method_title: "藍新金流",
      set_paid: false,
      billing: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address_1: customer.address,
        city: customer.city,
        state: customer.city,
        country: "TW",
      },
      line_items: lineItems,
    };

    const { data: wcOrder } = await api.post("orders", orderData);
    console.log(`✅ [DEBUG] WC 訂單建立成功 ID: ${wcOrder.id}`);

    // 3. 準備藍新參數
    const timestamp = Math.floor(Date.now() / 1000);
    const merchantOrderNo = `${wcOrder.id}_${timestamp}`;
    
    // ⚡️ 關鍵修正：判斷網址是否為 localhost
    const currentSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const isLocalhost = currentSiteUrl.includes("localhost");

    const tradeInfo = {
      MerchantID: process.env.NEWEBPAY_MERCHANT_ID,
      RespondType: "JSON",
      TimeStamp: timestamp,
      Version: process.env.NEWEBPAY_VERSION,
      MerchantOrderNo: merchantOrderNo,
      Amt: Math.floor(wcOrder.total),
      ItemDesc: "CIEMAN 精品訂單",
      Email: customer.email,
      LoginType: 0,
      
      // ReturnURL: 支付完成跳轉 (localhost 可以用)
      ReturnURL: `${currentSiteUrl}/api/payment-return`,
      
      // ClientBackURL: 失敗返回 (localhost 可以用)
      ClientBackURL: `${currentSiteUrl}/checkout/failed`,
    };

    // ⚡️ 只有在「非」localhost 時，才加入 NotifyURL
    // 這樣你在本機測試就不會報 Port 3000 錯誤了
    if (!isLocalhost) {
      tradeInfo.NotifyURL = `${currentSiteUrl}/api/payment-notify`;
      console.log("ℹ️ [DEBUG] 正式環境：已加入 NotifyURL");
    } else {
      console.log("⚠️ [DEBUG] 本地環境：已自動移除 NotifyURL 以避免錯誤");
    }

    // 4. 加密
    const aesString = encryptNewebPay(tradeInfo);
    const shaString = hashNewebPay(aesString);

    // 5. 回傳 (強制指定正式環境網址 core)
    res.status(200).json({
      status: "success",
      orderId: wcOrder.id,
      paymentData: {
        MerchantID: process.env.NEWEBPAY_MERCHANT_ID,
        TradeInfo: aesString,
        TradeSha: shaString,
        Version: process.env.NEWEBPAY_VERSION,
        // 強制使用正式環境網址，避免跑到 ccore
        Url: "https://core.newebpay.com/MPG/mpg_gateway" 
      }
    });

  } catch (error) {
    console.error("❌ [ERROR] 處理失敗:", error);
    res.status(500).json({ error: "建立訂單失敗", details: error.message });
  }
}