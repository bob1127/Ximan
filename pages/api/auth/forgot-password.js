import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // 1. 確保只接受 POST 請求
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Pages Router 是直接從 req.body 取得資料
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "請提供電子信箱" });
    }

    // 2. 這裡我們先寫死一個假 Token 測試寄信功能
    const resetToken = "test-token-123456"; 
    // 確保有抓到網址，如果沒有則預設 localhost
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`;

    // 3. 設定 Nodemailer 傳輸器
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // 記得這裡要是 Google 的「應用程式密碼」
      },
    });

    // 4. 設定信件內容
    const mailOptions = {
      from: `"KÉSH de¹" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "KÉSH de¹ 密碼重設要求",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="text-transform: uppercase; letter-spacing: 2px;">Reset Password</h2>
          <p>您好，</p>
          <p>我們收到了您重設密碼的請求。請點擊下方按鈕設定新密碼：</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">設定新密碼</a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            如果您並未提出此要求，請忽略這封信件。<br>
            此連結將在 1 小時後失效。
          </p>
        </div>
      `,
    };

    // 5. 寄出信件
    await transporter.sendMail(mailOptions);

    // 6. 成功回傳 (Pages Router 寫法)
    return res.status(200).json({ message: "重設密碼信件已寄出" });

  } catch (error) {
    console.error("寄信錯誤詳細資訊:", error);
    return res.status(500).json({ message: "伺服器錯誤，無法發送信件" });
  }
}