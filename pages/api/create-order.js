import crypto from 'crypto';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cartItems, customer } = req.body;

    // ... (WooCommerce 初始化與建立訂單部分省略，假設這裡都沒問題) ...
    // 為了除錯方便，我們假設 Woo 訂單建立成功，直接進入綠界部分
    // ⚠️ 正式上線前請把 Woo 的邏輯加回來，這裡專注測綠界

    // 模擬一個訂單 ID 與金額 (方便你直接測試)
    // 等綠界通了，再把下面這兩行換回真實的 wooOrder 資料
    const orderId = "TEST_" + Date.now(); 
    const totalAmount = 100; 

    // ==========================================
    // 🔥 除錯重點區：印出環境變數
    // ==========================================
    console.log("========= 綠界參數檢查開始 =========");
    console.log("1. 讀取到的 MerchantID:", process.env.ECPAY_MERCHANT_ID);
    console.log("2. 讀取到的 HashKey:", process.env.ECPAY_HASH_KEY ? "已讀取 (隱藏內容)" : "❌ 未讀取 (undefined)");
    console.log("3. 讀取到的 HashIV:", process.env.ECPAY_HASH_IV ? "已讀取 (隱藏內容)" : "❌ 未讀取 (undefined)");

    if (!process.env.ECPAY_MERCHANT_ID || !process.env.ECPAY_HASH_KEY || !process.env.ECPAY_HASH_IV) {
        throw new Error("環境變數讀取失敗！請確認 .env.local 檔案位置與內容");
    }

    const ECPAY_MERCHANT_ID = process.env.ECPAY_MERCHANT_ID;
    const ECPAY_HASH_KEY = process.env.ECPAY_HASH_KEY;
    const ECPAY_HASH_IV = process.env.ECPAY_HASH_IV;
    const ECPAY_BASE_URL = process.env.ECPAY_BASE_URL || "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5";
    
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 

    const MerchantTradeNo = `Woo_${Date.now().toString().slice(-10)}`; // 縮短一點避免太長
    
    const date = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    const MerchantTradeDate = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    // 準備參數
    const params = {
      MerchantID: ECPAY_MERCHANT_ID,
      MerchantTradeNo: MerchantTradeNo,
      MerchantTradeDate: MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: totalAmount,
      TradeDesc: 'CIEMAN Store Order',
      ItemName: `Order Test`, 
      ReturnURL: `${SITE_URL}/api/payment-return`, 
      ClientBackURL: `${SITE_URL}/checkout/success`, 
      // 🔥 嘗試修改：如果 ALL 失敗，強制改成 Credit 試試看
      ChoosePayment: 'ALL', 
      EncryptType: 1,
    };

    console.log("4. 準備傳送的參數 (尚未加密):", params);

    // ==========================================
    // 計算 CheckMacValue
    // ==========================================
    const keys = Object.keys(params).filter(k => k !== 'CheckMacValue').sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    
    let rawString = `HashKey=${ECPAY_HASH_KEY}`;
    keys.forEach(key => {
      rawString += `&${key}=${params[key]}`;
    });
    rawString += `&HashIV=${ECPAY_HASH_IV}`;

    console.log("5. 排序後的原始字串 (檢查有無奇怪符號):", rawString);

    let encodedString = encodeURIComponent(rawString).toLowerCase();
    encodedString = encodedString
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%20/g, '+');

    params.CheckMacValue = crypto.createHash('sha256').update(encodedString).digest('hex').toUpperCase();

    console.log("6. 最終產生的 CheckMacValue:", params.CheckMacValue);
    console.log("========= 檢查結束 =========");

    res.status(200).json({
      status: 'success',
      paymentUrl: ECPAY_BASE_URL,
      paymentParams: params
    });

  } catch (error) {
    console.error("❌ 發生錯誤:", error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
}