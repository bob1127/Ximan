// pages/api/newebpay-notify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import axios from "axios";

const HASH_KEY = "OVB4Xd2HgieiLJJcj5RMx9W94sMKgHQx";
const HASH_IV = "PKetlaZYZcZvlMmC";
const WOOCOMMERCE_API_URL = "https://dyx.wxv.mybluehost.me/website_a8bfc44c/wp-json/wc/v3/orders";
const CONSUMER_KEY = "ck_0ed8acaab9f0bc4cd27c71c2e7ae9ccc3ca45b04";
const CONSUMER_SECRET = "cs_50ad8ba137c027d45615b0f6dc2d2d7ffcf97947";

function aesDecrypt(encryptedText: string, key: string, iv: string) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(iv, "utf8"));
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { TradeInfo } = req.body;

  try {
    const decrypted = aesDecrypt(TradeInfo, HASH_KEY, HASH_IV);
    const parsed = new URLSearchParams(decrypted);
    const data: Record<string, string> = {};
    parsed.forEach((value, key) => {
      data[key] = value;
    });

    console.log("🔐 藍新付款通知解密成功：", data);

    const { MerchantOrderNo, Status } = data;

    if (Status !== "SUCCESS") {
      console.log("⚠️ 非成功交易，不更新 WooCommerce 訂單");
      return res.status(200).send("SKIP");
    }

    // ✅ 取得 WooCommerce 訂單 ID（用 meta 查詢）
    const { data: orders } = await axios.get(WOOCOMMERCE_API_URL, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
      params: {
        search: MerchantOrderNo,
      },
    });

    const order = orders.find((o: any) =>
      o.meta_data?.some((meta: any) => meta.key === "newebpay_order_no" && meta.value === MerchantOrderNo)
    );

    if (!order) {
      console.error("❌ 找不到 WooCommerce 訂單");
      return res.status(404).send("NOT FOUND");
    }

    const orderId = order.id;

    // ✅ 更新訂單狀態為已付款
    await axios.put(
      `${WOOCOMMERCE_API_URL}/${orderId}`,
      { status: "processing" },
      {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
      }
    );

    console.log(`✅ 訂單 ${orderId} 已更新為 processing`);

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Notify 處理錯誤：", error);
    res.status(400).send("FAIL");
  }
}
