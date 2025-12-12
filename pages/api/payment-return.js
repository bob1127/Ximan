// pages/api/payment-return.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    
    // 解析訂單編號 (格式: 12345_16788888 -> 取 12345)
    const merchantOrderNo = data.MerchantOrderNo || "";
    const orderId = merchantOrderNo.split('_')[0]; 

    if (data.Status === 'SUCCESS') {
      // 轉址到購物車完成頁面 (或你的 Success 頁面)
      res.redirect(302, `/cart?orderNo=${orderId}`);
    } else {
      res.redirect(302, '/checkout/failed');
    }
  } else {
    res.status(405).end();
  }
}