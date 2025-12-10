// pages/api/payment-return.js

export default function handler(req, res) {
  // 藍新金流是用 POST 傳送交易結果回來
  if (req.method === 'POST') {
    const data = req.body;

    // 可以在這裡 Console.log 看看藍新回傳了什麼
    // console.log("藍新回傳結果:", data);

    // 判斷交易狀態
    if (data.Status === 'SUCCESS') {
      // 狀態成功 -> 轉址 (Redirect 302) 到成功頁面
      res.redirect(302, '/checkout/success');
    } else {
      // 狀態失敗 -> 轉址到失敗頁面
      res.redirect(302, '/checkout/failed');
    }
  } else {
    // 如果不是 POST，擋掉
    res.status(405).end();
  }
}