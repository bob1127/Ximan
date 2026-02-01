export default async function handler(req, res) {
  // 🔍 Debug 6: 確認 API 被呼叫
  console.log("[Social-Sync] API 被呼叫", req.body?.email);

  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;
  const wpUrl = process.env.WC_SITE_URL; 
  
  // 檢查環境變數
  if (!process.env.WP_ADMIN_USER || !process.env.WP_ADMIN_APP_PASSWORD) {
      console.error("[Social-Sync] 錯誤: 缺少 WP_ADMIN 環境變數");
      return res.status(500).json({ message: "Server config error" });
  }

  const adminAuth = Buffer.from(`${process.env.WP_ADMIN_USER}:${process.env.WP_ADMIN_APP_PASSWORD}`).toString('base64');

  try {
    // 1. 搜尋使用者
    console.log(`[Social-Sync] 正在搜尋使用者: ${email} 於 ${wpUrl}`);
    const searchRes = await fetch(`${wpUrl}/wp-json/wp/v2/users?search=${email}&context=edit`, {
      headers: { 'Authorization': `Basic ${adminAuth}` }
    });
    
    if (!searchRes.ok) {
        const errText = await searchRes.text();
        console.error("[Social-Sync] 搜尋失敗 (Response):", errText);
        throw new Error(`Search failed: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    console.log("[Social-Sync] 搜尋結果:", searchData.length > 0 ? "使用者已存在" : "使用者不存在");
    
    let userId;

    if (searchData.length > 0) {
      userId = searchData[0].id;
    } else {
      // 2. 建立新使用者
      console.log("[Social-Sync] 正在建立新使用者...");
      const createRes = await fetch(`${wpUrl}/wp-json/wp/v2/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${adminAuth}` 
        },
        body: JSON.stringify({
          username: email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
          email: email,
          name: name,
          password: Math.random().toString(36).slice(-10) + "!@#",
          roles: ['customer']
        })
      });
      
      const newUser = await createRes.json();
      if (!createRes.ok) {
          console.error("[Social-Sync] 建立失敗:", newUser);
          throw new Error("Create user failed");
      }
      userId = newUser.id;
      console.log("[Social-Sync] 新使用者建立成功 ID:", userId);
    }

    // 3. 請求 Token
    console.log("[Social-Sync] 正在請求 Token...");
    const tokenRes = await fetch(`${wpUrl}/wp-json/custom/v1/generate_social_token`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${adminAuth}`
        },
        body: JSON.stringify({ user_id: userId })
    });
    
    const tokenData = await tokenRes.json();
    console.log("[Social-Sync] Token 回傳:", tokenData.token ? "成功" : "失敗");
    
    res.status(200).json({ 
        success: true, 
        token: tokenData.token,
        user_id: userId 
    });

  } catch (error) {
    console.error("[Social-Sync] 最終錯誤 catch:", error);
    res.status(500).json({ message: error.message });
  }
}