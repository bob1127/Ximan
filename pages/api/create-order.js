import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import crypto from "crypto";

// 1. 初始化 WooCommerce
const api = new WooCommerceRestApi({
  url: process.env.WC_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

// 2. 藍新加密輔助函式 (AES-256-CBC)
function encryptNewebPay(data) {
  const key = process.env.NEWEBPAY_HASH_KEY;
  const iv = process.env.NEWEBPAY_HASH_IV;
  
  const params = new URLSearchParams(data).toString();

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(params, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// 3. 藍新 SHA256 壓碼輔助函式
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
    const { cartItems, customer } = req.body;

    // --- A. 準備 WooCommerce 訂單資料 ---
    if (!cartItems || cartItems.length === 0) {
        throw new Error("購物車是空的");
    }

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

    // --- B. 在 WooCommerce 建立訂單 ---
    const { data: wcOrder } = await api.post("orders", orderData);
    
    const orderId = wcOrder.id;
    const totalAmount = wcOrder.total; 

    // --- C. 準備藍新金流參數 ---
    const timestamp = Math.floor(Date.now() / 1000);
    console.log(`建立訂單: ${orderId}, 金額: ${totalAmount}`);

    const merchantOrderNo = `${orderId}_${timestamp}`; 

    const tradeInfo = {
      MerchantID: process.env.NEWEBPAY_MERCHANT_ID,
      RespondType: "JSON",
      TimeStamp: timestamp,
      Version: process.env.NEWEBPAY_VERSION,
      MerchantOrderNo: merchantOrderNo,
      Amt: Math.floor(totalAmount), 
      ItemDesc: "CIEMAN 精品包訂單", 
      Email: customer.email,
      LoginType: 0,
      
      // 👇👇👇 重點修改：這裡改成指向 API，而不是直接指向頁面
      ReturnURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment-return`,
      
      ClientBackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failed`, 
      NotifyURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment-notify`, 
    };

    // --- D. 加密資料 ---
    const aesString = encryptNewebPay(tradeInfo);
    const shaString = hashNewebPay(aesString);

    // --- E. 回傳給前端 ---
    res.status(200).json({
      status: "success",
      orderId: orderId,
      paymentData: {
        MerchantID: process.env.NEWEBPAY_MERCHANT_ID,
        TradeInfo: aesString,
        TradeSha: shaString,
        Version: process.env.NEWEBPAY_VERSION,
        Url: process.env.NEWEBPAY_URL
      }
    });

  } catch (error) {
    console.error("Order creation failed:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "建立訂單失敗", details: error.message });
  }
}