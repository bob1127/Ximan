// pages/api/categories.js

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "slug is required" });
  }

  const baseUrl = process.env.WC_SITE_URL;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  if (!baseUrl || !key || !secret) {
    return res.status(500).json({
      error: "WooCommerce env variables are not set",
      detail: { baseUrl, hasKey: !!key, hasSecret: !!secret },
    });
  }

  try {
    // ✅ 用 WooCommerce v2，orderby 改成 name（你的錯誤訊息允許的值）
    const url =
      `${baseUrl}/wp-json/wc/v2/products/categories` +
      `?per_page=100&hide_empty=false&orderby=name&order=asc` +
      `&consumer_key=${encodeURIComponent(key)}` +
      `&consumer_secret=${encodeURIComponent(secret)}`;

    const wcRes = await fetch(url);
    const text = await wcRes.text();

    let allCategories = [];
    try {
      allCategories = JSON.parse(text);
    } catch (e) {
      console.error("解析 WooCommerce 回應失敗：", text);
      return res.status(500).json({
        error: "failed to parse WooCommerce response",
        detail: text,
      });
    }

    if (!wcRes.ok || !Array.isArray(allCategories)) {
      console.error("WooCommerce API error:", wcRes.status, text);
      return res.status(500).json({
        error: "failed to fetch product categories from WooCommerce",
        detail: { status: wcRes.status, body: text },
      });
    }

    console.log("全部分類數量:", allCategories.length);

    // 1️⃣ 找到父分類 (slug = "categories" / "brand")
    const parent = allCategories.find((cat) => cat.slug === slug);

    if (!parent) {
      console.warn("找不到父分類 slug:", slug);
      return res.status(200).json([]); // 找不到就回空陣列
    }

    console.log("父分類找到:", parent.id, parent.name);

    // 2️⃣ 從同一批資料裡 filter 出子分類
    const children = allCategories.filter(
      (cat) => cat.parent === parent.id
    );

    console.log(`子分類數量 (${slug}):`, children.length);

    return res.status(200).json(children);
  } catch (error) {
    console.error("Unhandled WooCommerce API error:", error);
    return res.status(500).json({
      error: "unexpected error while fetching categories",
      detail: String(error),
    });
  }
}
