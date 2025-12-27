// pages/api/payuni/notify.js
import crypto from "crypto";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "querystring";

// PayUni EncryptInfo 解密：hex -> "base64cipher:::base64tag" -> plaintext(querystring)
function decryptPayUniGCM(encryptHex, keyBuf, ivBuf) {
  const packed = Buffer.from(String(encryptHex || ""), "hex").toString("utf8");
  const [cipherB64, tagB64] = packed.split(":::");
  if (!cipherB64 || !tagB64) throw new Error("EncryptInfo format invalid");

  const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuf, ivBuf);
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));

  let plaintext = decipher.update(cipherB64, "base64", "utf8");
  plaintext += decipher.final("utf8");
  return plaintext;
}

// SHA256：SHA256(key + encryptStr + iv)
function sha256PayUni(encryptStr, keyRaw, ivBuf) {
  const hash = crypto
    .createHash("sha256")
    .update(`${keyRaw}${encryptStr}${ivBuf.toString()}`);
  return hash.digest("hex").toUpperCase();
}

// 判斷付款成功（容錯）
function isPaidSuccess(obj) {
  const v = (x) => String(x ?? "").toUpperCase();

  const rtnCode = v(obj.RtnCode || obj.Rtncode || obj.ReturnCode || obj.Status);
  const tradeStatus = v(obj.TradeStatus || obj.TradeStatusCode || obj.PayStatus);

  if (rtnCode === "1" || rtnCode === "SUCCESS" || rtnCode === "OK") return true;
  if (tradeStatus === "1" || tradeStatus === "SUCCESS" || tradeStatus === "OK")
    return true;

  return false;
}

// 小工具：讀 meta
function getMetaValue(metaArr, key) {
  const m = (Array.isArray(metaArr) ? metaArr : []).find((x) => x?.key === key);
  return m?.value;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!MerID || !HashKeyRaw || !HashIVRaw || !SITE_URL) {
      throw new Error("PayUni env missing (MerID/HashKey/HashIV/SITE_URL)");
    }
    if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      throw new Error("Woo env missing");
    }

    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    const body = req.body || {};
    const recvMerID = body.MerID || body.MerId || body.merid;
    const EncryptInfo = body.EncryptInfo || body.encryptInfo || body.Encryptinfo;
    const HashInfo = body.HashInfo || body.hashInfo || body.Hashinfo;

    console.log("=== PAYUNI NOTIFY RAW BODY ===");
    console.log(body);

    if (!EncryptInfo || !HashInfo) {
      return res.status(400).send("Missing EncryptInfo/HashInfo");
    }
    if (recvMerID && String(recvMerID) !== String(MerID)) {
      return res.status(400).send("MerID mismatch");
    }

    // 1) 驗 HashInfo
    const expectedHash = sha256PayUni(EncryptInfo, HashKeyRaw, ivBuf);
    if (String(HashInfo).toUpperCase() !== expectedHash) {
      console.error("HashInfo mismatch", { HashInfo, expectedHash });
      return res.status(400).send("HashInfo mismatch");
    }

    // 2) 解密
    const plaintext = decryptPayUniGCM(EncryptInfo, keyBuf, ivBuf);
    const data = querystring.parse(plaintext);

    console.log("=== PAYUNI NOTIFY DECRYPTED ===");
    console.log("plaintext:", plaintext);
    console.log("parsed:", data);

    // 3) 取訂單號
    const orderNo =
      data.MerTradeNo || data.mertradeno || data.MerTradeNO || data.OrderNo;
    if (!orderNo) {
      return res.status(400).send("Missing MerTradeNo");
    }

    // 4) 判斷付款成功
    const paid = isPaidSuccess(data);

    // 5) Woo API
    const api = new WooCommerceRestApi({
      url: WC_SITE_URL,
      consumerKey: WC_CONSUMER_KEY,
      consumerSecret: WC_CONSUMER_SECRET,
      version: "wc/v3",
    });

    // 6) 先抓訂單，做「防重複處理」
    const orderRes = await api.get(
      `orders/${encodeURIComponent(String(orderNo))}`
    );
    const order = orderRes.data;

    const meta = Array.isArray(order.meta_data) ? order.meta_data : [];
    const paidMarked = String(getMetaValue(meta, "_payuni_paid") || "0") === "1";
    const emailSent =
      String(getMetaValue(meta, "_email_payment_success_sent") || "0") === "1";

    // 物流相關 meta（你要在 create-order 時存）
    const shippingType =
      String(getMetaValue(meta, "_shipping_type") || "") ||
      String(getMetaValue(meta, "shipping_type") || "");

    const shipCreated =
      String(getMetaValue(meta, "_payuni_ship_created") || "0") === "1";

    // 這個是「防同時重複觸發」用（我們會在 notify 先寫入，再去呼叫物流 API）
    const shipTriggered =
      String(getMetaValue(meta, "_payuni_ship_triggered") || "0") === "1";

    // 交易序號（若 PayUni 有回傳）
    const transactionId =
      data.TradeNo || data.TradeNO || data.TransactionId || data.PayNo || "";

    if (paid) {
      // ✅ 付款成功：更新 Woo 訂單（防重複）
      if (!paidMarked) {
        await api.put(`orders/${encodeURIComponent(String(orderNo))}`, {
          status: "processing",
          set_paid: true,
          transaction_id: transactionId ? String(transactionId) : undefined,
          meta_data: [
            { key: "_payuni_paid", value: "1" },
            { key: "_payuni_notify_time", value: String(Date.now()) },
            ...(transactionId
              ? [{ key: "_payuni_trade_no", value: String(transactionId) }]
              : []),
          ],
        });
        console.log(`✅ Woo order #${orderNo} updated to processing`);
      } else {
        console.log(
          `ℹ️ Woo order #${orderNo} already marked paid, skip status update`
        );
      }

      // ✅ 付款成功信（防重複）
      if (!emailSent) {
        fetch(`${SITE_URL}/api/send-order-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderNo,
            type: "PAYMENT_SUCCESS",
            transactionId: transactionId ? String(transactionId) : undefined,
          }),
        }).catch((e) =>
          console.error("send PAYMENT_SUCCESS email failed:", e)
        );
      } else {
        console.log(
          `ℹ️ payment success email already sent for order #${orderNo}`
        );
      }

      // ✅ ✅ ✅ 付款成功後：若是 7-11 店到店，觸發物流取號（防重複）
      // 你在前端/建單要設 shippingType = "CVS_711"
      if (shippingType === "CVS_711") {
        if (shipCreated) {
          console.log(`ℹ️ logistics already created for order #${orderNo}`);
        } else if (shipTriggered) {
          console.log(`ℹ️ logistics already triggered for order #${orderNo}`);
        } else {
          // 先寫入 triggered，避免 PayUni 重送 notify 時同時打多次取號
          await api.put(`orders/${encodeURIComponent(String(orderNo))}`, {
            meta_data: [
              { key: "_payuni_ship_triggered", value: "1" },
              { key: "_payuni_ship_triggered_time", value: String(Date.now()) },
            ],
          });

          // 再呼叫你自己的物流 API（這支 API 內會去打 PayUni /api/logistics/trade）
          fetch(`${SITE_URL}/api/payuni/logistics/trade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: orderNo }),
          })
            .then(async (r) => {
              const t = await r.text().catch(() => "");
              console.log(
                `✅ logistics/trade triggered for order #${orderNo}, status=${r.status}, body=${t}`
              );
            })
            .catch((e) =>
              console.error(`❌ logistics/trade trigger failed for #${orderNo}`, e)
            );
        }
      }

      return res.status(200).send("OK");
    } else {
      console.log(`⚠️ PayUni notify not paid, order #${orderNo} keep pending`);
      return res.status(200).send("OK");
    }
  } catch (err) {
    console.error("❌ payuni notify error:", err);
    // 這裡你可選擇回 200 吞掉避免 PayUni 一直重送；但目前你原本是 500
    return res.status(500).send("Server Error");
  }
}
