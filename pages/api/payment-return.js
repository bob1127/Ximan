// pages/api/payment-return.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    
    // 綠界回傳的訂單編號 (格式: EC123456789)
    // 我們需要解析出原始 WooCommerce Order ID
    // 假設我們在 create-order 產生的是 `EC${orderId}${亂數}`
    // 這裡如果你想精準抓出 Order ID 可能要用 Regex，或者直接導回 Cart 頁面讓它重新整理
    
    // 綠界成功代碼是 '1'
    if (data.RtnCode === '1') {
        // 為了簡單起見，我們直接導向成功頁面
        // 如果你需要帶 Order ID，可以嘗試解析 data.MerchantTradeNo
        // 但因為綠界 MerchantTradeNo 必須唯一，所以我們加了亂數，解析比較麻煩
        // 建議直接導向 /checkout/success 或是帶上參數
        
        // 嘗試解析: EC + ID + 4位亂數 -> 去掉頭2位和尾4位 (僅供參考)
        // 這裡示範簡單轉址
        res.redirect(302, '/checkout/success');
    } else {
        console.error("綠界付款失敗:", data.RtnMsg);
        res.redirect(302, '/checkout/failed');
    }
  } else {
    res.status(405).end();
  }
}