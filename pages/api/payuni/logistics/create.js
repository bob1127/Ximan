// pages/api/payuni/logistics/create.js
import crypto from "crypto";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "querystring";

function encryptPayUniGCM(plaintext, keyBuf, ivBuf) { /* 跟你 create-order 一樣 */ }
function decryptPayUniGCM(encryptHex, keyBuf, ivBuf) { /* 跟你 notify 一樣 */ }
function sha256PayUni(encryptStr, keyRaw, ivBuf) { /* 跟你 create-order 一樣 */ }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { orderId } = req.body || {};

    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;
    const PAYUNI_LOGISTICS_URL = process.env.PAYUNI_LOGISTICS_URL;

    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    const api = new WooCommerceRestApi({
      url: WC_SITE_URL,
      consumerKey: WC_CONSUMER_KEY,
      consumerSecret: WC_CONSUMER_SECRET,
      version: "wc/v3",
    });

    const orderRes = await api.get(`orders/${encodeURIComponent(String(orderId))}`);
    const order = orderRes.data;
    const meta = Array.isArray(order.meta_data) ? order.meta_data : [];
    const getMeta = (k) => meta.find((m) => m?.key === k)?.value;

    if (String(getMeta("_payuni_logistics_created") || "0") === "1") {
      return res.status(200).json({ status: "ok", message: "logistics already created" });
    }

    const shippingType = String(getMeta("_shipping_type") || "HOME_TCAT");

    // 取必要資訊
    const receiverName = order?.shipping?.first_name || order?.billing?.first_name || "";
    const receiverPhone = order?.billing?.phone || "";
    const address = order?.shipping?.address_1 || order?.billing?.address_1 || "";
    const city = order?.shipping?.city || order?.billing?.city || "";
    const postcode = order?.shipping?.postcode || order?.billing?.postcode || "";

    const cvsStoreId = String(getMeta("_cvs_store_id") || "");
    const cvsStoreName = String(getMeta("_cvs_store_name") || "");
    const cvsStoreAddress = String(getMeta("_cvs_store_address") || "");

    // TODO：依 PAYUNi 物流文件組 payload（不同物流類型欄位不同）
    const payload = {
      MerID,
      Timestamp: Math.floor(Date.now() / 1000),
      OrderNo: String(order.id),

      // 共同欄位（示意）
      ReceiverName: receiverName,
      ReceiverPhone: receiverPhone,

      ...(shippingType === "CVS_711"
        ? {
            // 7-11 超取必填（示意：實際欄位名以文件為準）
            StoreID: cvsStoreId,
            StoreName: cvsStoreName,
            StoreAddr: cvsStoreAddress,
          }
        : {
            // 黑貓宅配必填（示意）
            ReceiverAddr: `${city}${address}`,
            ReceiverZip: postcode,
          }),
    };

    const plaintext = querystring.stringify(payload);
    const EncryptInfo = encryptPayUniGCM(plaintext, keyBuf, ivBuf);
    const HashInfo = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);

    // call PayUni logistics
    const resp = await fetch(PAYUNI_LOGISTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ MerID, EncryptInfo, HashInfo, Version: "1.0" }),
    });

    const json = await resp.json();

    // TODO：依回傳欄位驗 hash、解密（很多情況回傳也是 EncryptInfo/HashInfo）
    // const expected = sha256PayUni(json.EncryptInfo, HashKeyRaw, ivBuf);
    // const decrypted = querystring.parse(decryptPayUniGCM(json.EncryptInfo, keyBuf, ivBuf));

    // 假設你拿到物流單號
    const logisticsNo = json?.LogisticsNo || ""; // TODO: 依實際欄位

    await api.put(`orders/${encodeURIComponent(String(orderId))}`, {
      meta_data: [
        { key: "_payuni_logistics_created", value: "1" },
        { key: "_payuni_logistics_no", value: String(logisticsNo) },
        { key: "_payuni_logistics_raw", value: JSON.stringify(json || {}) },
      ],
    });

    return res.status(200).json({ status: "success", logisticsNo });
  } catch (e) {
    console.error("logistics create error:", e);
    return res.status(500).json({ status: "error", message: e?.message || "server error" });
  }
}
