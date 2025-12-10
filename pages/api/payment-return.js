// pages/api/payment-return.js

export default function handler(req, res) {
  // 🔥 DEBUG LOG: 當藍新把使用者踢回來時，這行會出現在 Vercel Logs
  console.log("==========================================");
  console.log(`[DEBUG] Payment-Return 被觸發! Method: ${req.method}`);
  
  // 藍新金流是用 POST 傳送交易結果回來
  if (req.method === 'POST') {
    const data = req.body;

    // 🔥 DEBUG LOG: 看看藍新回傳了什麼狀態
    console.log("[DEBUG] 藍新回傳資料 (Status):", data.Status);
    console.log("[DEBUG] 藍新回傳資料 (Message):", data.Message);

    // 判斷交易狀態
    if (data.Status === 'SUCCESS') {
      console.log("[DEBUG] 交易成功 -> 轉址到 Success 頁面");
      // 狀態成功 -> 轉址 (Redirect 302) 到成功頁面
      res.redirect(302, '/checkout/success');
    } else {
      console.log("[DEBUG] 交易失敗 -> 轉址到 Failed 頁面");
      // 狀態失敗 -> 轉址到失敗頁面
      res.redirect(302, '/checkout/failed');
    }
  } else {
    // 如果不是 POST，擋掉
    console.log("[ERROR] 錯誤的請求方法 (收到 GET)");
    res.status(405).end();
  }
  console.log("==========================================");
}