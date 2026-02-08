// pages/api/auth/register.js
import nodemailer from "nodemailer";
// 🔥 重要：從 send-otp 引入同一個 store
import { otpStore } from "./send-otp"; 

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { username, email, password, otp } = req.body;

  // 1. 檢查是否有輸入驗證碼
  if (!otp) return res.status(400).json({ message: "請輸入驗證碼" });

  // 2. 從暫存區取出該 Email 的紀錄
  const record = otpStore.get(email);

  // 🔥 這裡就是您原本報錯的地方
  if (!record) {
    return res.status(400).json({ message: "驗證碼已過期或不存在，請重新發送" });
  }

  if (record.code !== otp) {
    return res.status(400).json({ message: "驗證碼錯誤，請重新輸入" });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ message: "驗證碼已失效，請重新發送" });
  }

  try {
    // 3. 呼叫 WooCommerce 建立使用者
    // (請確認 .env.local 有設定 WC_SITE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET)
    const wpUrl = process.env.WC_SITE_URL;
    const ck = process.env.WC_CONSUMER_KEY;
    const cs = process.env.WC_CONSUMER_SECRET;

    const wpRes = await fetch(`${wpUrl}/wp-json/wc/v3/customers?consumer_key=${ck}&consumer_secret=${cs}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        username: username || email.split("@")[0],
        password: password,
        first_name: username,
      }),
    });

    const wpData = await wpRes.json();

    if (!wpRes.ok) {
        throw new Error(wpData.message || "建立帳號失敗 (Email 可能已被註冊)");
    }

    // 4. 註冊成功，刪除驗證碼
    otpStore.delete(email);

    // 5. 寄送歡迎信
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"KÉSH de¹" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "歡迎加入 KÉSH de¹",
      html: `<h2>恭喜 ${username}，註冊成功！</h2><p>歡迎開始您的購物旅程。</p>`,
    });

    res.status(200).json({ message: "註冊成功", user: wpData });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
}