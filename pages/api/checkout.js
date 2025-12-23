import crypto from 'crypto';

// PayUni 加密工具函式
function encryptPayUni(data, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function sha256Hash(string) {
  return crypto.createHash('sha256').update(string).digest('hex').toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cartItems, customer } = req.body;

    // --- 這裡保留你原本建立 WooCommerce 訂單的 logic (省略) ---
    // 假設已取得 orderId 與 totalAmount
    const orderId = "Order_" + Date.now(); 
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 1. 讀取環境變數
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKey = process.env.PAYUNI_HASH_KEY;
    const HashIV = process.env.PAYUNI_HASH_IV;
    const PAYUNI_URL = process.env.PAYUNI_BASE_URL;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!MerID || !HashKey || !HashIV) {
      throw new Error("PayUni 環境變數缺失");
    }

    // 2. 準備 PayUni 原始參數 (由 PayUni 定義的欄位名)
    const tradeParams = {
      MerID: MerID,
      MerOrderNo: orderId,
      Amt: totalAmount,
      ItemName: `CIEMAN Store Order - ${orderId}`,
      ReturnURL: `${SITE_URL}/api/payment-return`, // 背景通知
      NotifyURL: `${SITE_URL}/api/payment-notify`, // 同步通知
      BackURL: `${SITE_URL}/checkout/success`,     // 使用者返回按鈕
      UsrMail: customer.email,
      Timestamp: Math.floor(Date.now() / 1000),
      // 可指定支付方式：CARD (信用卡), ATM, CVS (超商), ICASH (icash Pay)
      // 若不指定則會進入 PayUni 選擇頁面
    };

    // 3. 進行加密流程
    // A. 將參數轉為 Query String
    const rawString = Object.keys(tradeParams)
      .map(key => `${key}=${encodeURIComponent(tradeParams[key])}`)
      .join('&');

    // B. AES 加密產生 TradeInfo
    const TradeInfo = encryptPayUni(rawString, HashKey, HashIV);

    // C. SHA256 加密產生 TradeSha (Key + TradeInfo + IV)
    const TradeSha = sha256Hash(HashKey + TradeInfo + HashIV);

    console.log("========= PayUni 加密檢查 =========");
    console.log("Order No:", orderId);
    console.log("TradeInfo:", TradeInfo);
    console.log("TradeSha:", TradeSha);

    // 4. 回傳給前端，由前端自動 Submit Form
    res.status(200).json({
      status: 'success',
      paymentUrl: PAYUNI_URL,
      MerchantID: MerID, // PayUni 前端 Form 需要的欄位名
      TradeInfo: TradeInfo,
      TradeSha: TradeSha
    });

  } catch (error) {
    console.error("❌ PayUni Checkout Error:", error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
}