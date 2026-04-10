// @ts-nocheck
import { AbstractPaymentProvider } from "@medusajs/utils";

class tappay extends AbstractPaymentProvider {
  static identifier = "tappay";

  constructor(container: any) {
    super(container);
    console.log("🚀🚀🚀 [狂賀] TapPay 成功登入系統大腦！準備執行扣款！");
  }

  async initiatePayment(context: any) { 
    // 🔥 致命錯誤修正：必須保存 context.data，否則 prime 密碼會不見！
    return { id: "tappay_" + Date.now(), status: "pending", data: context.data || {} }; 
  }

  async authorizePayment(sessionData: any, context: any) {
    try {
      const prime = sessionData.prime || context.data?.prime;
      const cvsInfo = sessionData.cvs_info || context.data?.cvs_info;

      if (!prime) throw new Error("❌ 缺少 TapPay Prime 授權碼");

      const partnerKey = process.env.TAPPAY_PARTNER_KEY || "";
      const merchantId = process.env.TAPPAY_MERCHANT_ID || "";
      const env = process.env.TAPPAY_ENV || "sandbox";
      const apiUrl = env === "production" 
        ? "https://prod.tappaysdk.com/tpc/payment/pay-by-prime"
        : "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime";

      const payload: any = {
        prime: prime,
        partner_key: partnerKey,
        merchant_id: merchantId,
        details: `KESH Store Order`,
        amount: Math.round(context.amount),
        cardholder: {
          phone_number: context.billing_address?.phone || context.shipping_address?.phone || "0900000000",
          name: `${context.billing_address?.first_name || ""} ${context.billing_address?.last_name || ""}`.trim() || "Customer",
          email: context.email || "customer@example.com",
        },
        remember: false
      };

      if (cvsInfo && cvsInfo.storeId) {
        payload.logistics_type = "C2C";
        payload.extra_info = {
          shipping_recipient_info: {
            ship_type: cvsInfo.shipType,
            store_id: cvsInfo.storeId,
            shop_name: "KESH"
          }
        };
      }

      console.log("發送 TapPay 扣款請求中...", payload);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": partnerKey },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 0) {
        console.log(`✅ TapPay 扣款成功！交易序號: ${result.rec_trade_id}`);
        return { 
          status: "authorized", 
          data: { ...sessionData, tappay_result: result, rec_trade_id: result.rec_trade_id } 
        };
      } else {
        console.error("❌ TapPay 扣款失敗:", result.msg);
        return { status: "error", data: { ...sessionData, error: result.msg } };
      }
    } catch (error: any) {
      console.error("❌ TapPay 系統發生例外錯誤:", error);
      return { status: "error", data: { error: error.message } };
    }
  }

  async updatePayment(context: any) { 
    // 🔥 同樣必須保存資料
    return { id: context.id || "tappay_" + Date.now(), status: "pending", data: context.data || {} }; 
  }
  
  async capturePayment(paymentData: any) { return paymentData; }
  async cancelPayment(paymentData: any) { return paymentData; }
  async deletePayment(paymentData: any) { return paymentData; }
  async getPaymentStatus(paymentData: any) { return paymentData.status || "authorized"; }
  async refundPayment(paymentData: any, refundAmount: number) { return paymentData; }
  async retrievePayment(paymentData: any) { return paymentData; }
}

export default tappay;