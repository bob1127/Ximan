// pages/api/create-order.js
import crypto from 'crypto';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// 初始化 Woo API
const api = new WooCommerceRestApi({
  url: process.env.WOO_URL,
  consumerKey: process.env.WOO_CK,
  consumerSecret: process.env.WOO_CS,
  version: "wc/v3"
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cartItems, customer } = req.body;

    // ==========================================
    // 1. 先在 WooCommerce 建立訂單
    // ==========================================
    
    // 整理購物車格式給 Woo
    const line_items = cartItems.map(item => ({
      product_id: item.id, // 確保前端有傳 product_id
      quantity: item.quantity
    }));

    const orderData = {
      payment_method: "ecpay",
      payment_method_title: "綠界科技 ECPay",
      set_paid: false, // 先設為未付款
      billing: {
        first_name: customer?.name || "Guest",
        email: customer?.email || "guest@example.com",
        phone: customer?.phone || "",
        // ...其他地址欄位
      },
      line_items: line_items,
    };

    // 呼叫 Woo API 建立訂單
    const wooResponse = await api.post("orders", orderData);
    
    if (wooResponse.status !== 201) {
      throw new Error("無法在 WooCommerce 建立訂單");
    }

    const wooOrder = wooResponse.data;
    const orderId = wooOrder.id; // 拿到真正的訂單編號 (例如: 1502)
    const totalAmount = parseInt(wooOrder.total); // 拿到真正的總金額

    // ==========================================
    // 2. 準備綠界參數 (使用 Woo 的訂單編號)
    // ==========================================
    
    // 注意：MerchantTradeNo 必須唯一。
    // 為了避免重複 (例如同一張單重複結帳)，通常會加上時間戳記或後綴
    // 例如: "Woo_1502_170238123"
    const MerchantTradeNo = `Woo_${orderId}_${Date.now().toString().slice(-6)}`;
    
    // 處理時間格式
    const date = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    const MerchantTradeDate = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    // 從環境變數讀取綠界設定
    const { ECPAY_MERCHANT_ID, ECPAY_HASH_KEY, ECPAY_HASH_IV, ECPAY_BASE_URL } = process.env;

    const params = {
      MerchantID: ECPAY_MERCHANT_ID,
      MerchantTradeNo: MerchantTradeNo,
      MerchantTradeDate: MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: totalAmount,
      TradeDesc: 'CIEMAN Store Order',
      ItemName: `Order #${orderId}`, // 簡單顯示訂單號碼即可，避免特殊字元過長
      ReturnURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment-return`, // 背景通知網址
      ClientBackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`, // 前端成功頁面
      ChoosePayment: 'Credit', // 正式環境視需求改為 'ALL'
      EncryptType: 1,
      CustomField1: orderId.toString(), // ★重要：把 Woo 訂單 ID 藏在這裡，方便 ReturnURL 抓回來更新狀態
    };

    // ==========================================
    // 3. 計算 CheckMacValue
    // ==========================================
    const keys = Object.keys(params).filter(k => k !== 'CheckMacValue').sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    
    let rawString = `HashKey=${ECPAY_HASH_KEY}`;
    keys.forEach(key => {
      rawString += `&${key}=${params[key]}`;
    });
    rawString += `&HashIV=${ECPAY_HASH_IV}`;

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

    // ==========================================
    // 4. 回傳
    // ==========================================
    console.log(`Woo 訂單 #${orderId} 建立成功，準備前往綠界`);

    res.status(200).json({
      status: 'success',
      paymentUrl: ECPAY_BASE_URL,
      paymentParams: params
    });

  } catch (error) {
    console.error("建立訂單錯誤:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}