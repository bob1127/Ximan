// pages/api/auth/register.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, username, password, first_name, last_name } = req.body;
  
  const siteUrl = process.env.WC_SITE_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  try {
    // 使用 WooCommerce 官方 API 建立顧客
    // 這裡需要 Basic Auth (CK/CS)
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await fetch(`${siteUrl}/wp-json/wc/v3/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        email,
        username: username || email, // 若沒填使用者名稱，預設用 email
        password,
        first_name,
        last_name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '註冊失敗');
    }

    res.status(200).json({ message: '註冊成功', data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}