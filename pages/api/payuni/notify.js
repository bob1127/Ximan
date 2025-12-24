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

  // 有些會回傳 TradeAmt/PayTime 等，但不回成功碼，這裡不做推測，避免誤判
  return false;
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
    const orderRes = await api.get(`orders/${encodeURIComponent(String(orderNo))}`);
    const order = orderRes.data;
    const meta = Array.isArray(order.meta_data) ? order.meta_data : [];
    const getMeta = (k) => meta.find((m) => m?.key === k)?.value;
    const paidMarked = String(getMeta("_payuni_paid") || "0") === "1";
    const emailSent = String(getMeta("_email_payment_success_sent") || "0") === "1";

    // 交易序號（若 PayUni 有回傳）
    const transactionId =
      data.TradeNo || data.TradeNO || data.TransactionId || data.PayNo || "";

    if (paid) {
      // ✅ 如果已經處理過 paid，直接回 OK（避免重複改狀態）
      if (!paidMarked) {
        await api.put(`orders/${encodeURIComponent(String(orderNo))}`, {
          status: "processing",
          set_paid: true,
          transaction_id: transactionId ? String(transactionId) : undefined,
          meta_data: [
            { key: "_payuni_paid", value: "1" },
            { key: "_payuni_notify_time", value: String(Date.now()) },
            ...(transactionId ? [{ key: "_payuni_trade_no", value: String(transactionId) }] : []),
          ],
        });
        console.log(`✅ Woo order #${orderNo} updated to processing`);
      } else {
        console.log(`ℹ️ Woo order #${orderNo} already marked paid, skip status update`);
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
        }).catch((e) => console.error("send PAYMENT_SUCCESS email failed:", e));
      } else {
        console.log(`ℹ️ payment success email already sent for order #${orderNo}`);
      }

      return res.status(200).send("OK");
    } else {
      console.log(`⚠️ PayUni notify not paid, order #${orderNo} keep pending`);
      return res.status(200).send("OK");
    }
  } catch (err) {
    console.error("❌ payuni notify error:", err);
    // 讓 PayUni 重送以便修復（或你也可回 200 吞錯）
    return res.status(500).send("Server Error");
  }
}
