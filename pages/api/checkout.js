// pages/api/checkout.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { billing, shipping, line_items, customer_id } = req.body;
  
  const siteUrl = process.env.WC_SITE_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;
  
  // Basic Auth 加密
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    // 準備 WooCommerce 訂單資料結構
    const orderData = {
      payment_method: 'bacs', // 預設銀行轉帳 (先做這步，之後可接綠界)
      payment_method_title: 'Direct Bank Transfer',
      set_paid: false,
      customer_id: customer_id || 0, // 如果有登入就帶 ID，沒登入就是 0 (訪客)
      billing: billing,
      shipping: shipping,
      line_items: line_items, // 購物車商品陣列
      status: 'processing' // 直接設為處理中
    };

    const response = await fetch(`${siteUrl}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Order creation failed');
    }

    // 回傳成功建立的訂單 ID
    res.status(200).json({ orderId: data.id, success: true });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: error.message });
  }
}