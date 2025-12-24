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

// 判斷付款成功（PayUni 欄位名稱可能依你申請的版本不同，這裡做「多條件容錯」）
function isPaidSuccess(obj) {
  const v = (x) => String(x ?? "").toUpperCase();

  // 常見可能欄位（不保證全都有）
  const rtnCode = v(obj.RtnCode || obj.Rtncode || obj.ReturnCode || obj.Status);
  const tradeStatus = v(obj.TradeStatus || obj.TradeStatusCode || obj.PayStatus);

  // 常見成功值：'1' / 'SUCCESS' / 'OK'
  if (rtnCode === "1" || rtnCode === "SUCCESS" || rtnCode === "OK") return true;
  if (tradeStatus === "1" || tradeStatus === "SUCCESS" || tradeStatus === "OK")
    return true;

  return false;
}

export default async function handler(req, res) {
  // PayUni 多半用 POST 通知
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const MerID = process.env.PAYUNI_MERCHANT_ID;
    const HashKeyRaw = process.env.PAYUNI_HASH_KEY;
    const HashIVRaw = process.env.PAYUNI_HASH_IV;

    const WC_SITE_URL = process.env.WC_SITE_URL;
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!MerID || !HashKeyRaw || !HashIVRaw) {
      throw new Error("PayUni env missing");
    }
    if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      throw new Error("Woo env missing");
    }

    const keyBuf = Buffer.from(HashKeyRaw, "utf8");
    const ivBuf = Buffer.from(HashIVRaw, "utf8");

    // PayUni 通常會送：EncryptInfo / HashInfo / MerID / Version...
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

    // 3) 取訂單號（你 create-order 用 MerTradeNo = wooOrder.id）
    const orderNo =
      data.MerTradeNo || data.mertradeno || data.MerTradeNO || data.OrderNo;
    if (!orderNo) {
      return res.status(400).send("Missing MerTradeNo");
    }

    // 4) 判斷付款成功
    const paid = isPaidSuccess(data);

    // 5) 更新 Woo 訂單狀態
    const api = new WooCommerceRestApi({
      url: WC_SITE_URL,
      consumerKey: WC_CONSUMER_KEY,
      consumerSecret: WC_CONSUMER_SECRET,
      version: "wc/v3",
    });

    if (paid) {
      // 交易序號（若 PayUni 有回傳）
      const transactionId =
        data.TradeNo || data.TradeNO || data.TransactionId || data.PayNo || "";

      await api.put(`orders/${encodeURIComponent(String(orderNo))}`, {
        status: "processing", // ✅ 你要的「處理中」
        set_paid: true,
        transaction_id: transactionId ? String(transactionId) : undefined,
        meta_data: [
          { key: "_payuni_paid", value: "1" },
          { key: "_payuni_notify_time", value: String(Date.now()) },
        ],
      });

      console.log(`✅ Woo order #${orderNo} updated to processing`);
      // PayUni 通常只要 200/OK
      return res.status(200).send("OK");
    } else {
      // 未成功可選擇標 failed/on-hold（看你需求）
      console.log(`⚠️ PayUni notify not paid, order #${orderNo} keep pending`);
      return res.status(200).send("OK");
    }
  } catch (err) {
    console.error("❌ payuni notify error:", err);
    // PayUni 通常還是會重試，所以回 500 讓它重送（或你也可回 200 但會吞錯）
    return res.status(500).send("Server Error");
  }
}
