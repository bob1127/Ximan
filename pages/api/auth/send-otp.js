import nodemailer from "nodemailer";

// 全域變數儲存 OTP (注意：重啟伺服器會清空)
// 使用 global 是為了防止 Next.js 在開發模式下重新編譯導致 Map 被重置
if (!global.otpStore) {
  global.otpStore = new Map();
}
export const otpStore = global.otpStore;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "不允許的方法 (Method Not Allowed)" });
  }

  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "請輸入電子信箱" });
  }

  // 🔍 檢查環境變數
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("❌ 錯誤：.env.local 檔案中缺少 GMAIL_USER 或 GMAIL_PASS");
    return res.status(500).json({ message: "系統設定錯誤：缺少郵件憑證" });
  }

  // 設定發信器
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // ⚠️ 必須是 16 位數應用程式密碼
    },
  });

  try {
    // 1. 產生 6 位數驗證碼
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. 存入暫存 (5 分鐘有效)
    otpStore.set(email, { 
      code: otp, 
      expires: Date.now() + 5 * 60 * 1000 
    });

    console.log(`準備發送郵件給: ${email}, 驗證碼: ${otp}`);

    // 3. 嘗試發送
    await transporter.verify(); // 先驗證連線是否正常

    await transporter.sendMail({
      from: `"KÉSH de¹ 凱仕國際精品" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "【KÉSH de¹】您的註冊驗證碼",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #ef4628;">KÉSH de¹ 驗證碼</h2>
          <p>親愛的顧客您好，</p>
          <p>這是您的電子郵件驗證碼：</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          <p style="color: #666;">此驗證碼將在 5 分鐘後失效。</p>
        </div>
      `,
    });

    console.log("✅ 郵件發送成功");
    return res.status(200).json({ message: "驗證碼已發送" });

  } catch (error) {
    console.error("❌ 發信失敗詳細原因:", error);
    
    // 判斷是否為密碼錯誤
    if (error.code === 'EAUTH') {
        return res.status(500).json({ message: "發信失敗：帳號或密碼錯誤 (請檢查應用程式密碼)" });
    }

    return res.status(500).json({ message: "發信失敗，請稍後再試或聯繫客服" });
  }
}