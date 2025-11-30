// pages/api/auth/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  const siteUrl = process.env.WC_SITE_URL;

  try {
    // 呼叫 WordPress JWT 插件的登入接口
    const response = await fetch(`${siteUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '登入失敗，請檢查帳號密碼');
    }

    // 登入成功，回傳 Token 與基本資料
    res.status(200).json({
      token: data.token,
      user_email: data.user_email,
      user_nicename: data.user_nicename,
      user_display_name: data.user_display_name,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}