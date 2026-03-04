// components/PrivacyPolicy.jsx 或者直接放在 pages/privacy.jsx

import React from "react";
import Head from "next/head";

const PrivacyPolicy = () => {
  // 替換為您的實際聯絡資訊
  const CONTACT_INFO = {
    email: "contact@kesh-de1.com",
    phone: "+886 912-345-678", // 請確認這是否為真實電話，如果是範例請修改
    companyName: "KESH LUXURY CO., LTD",
    siteName: "KÉSH de¹ 凱仕國際精品",
  };

  const currentDate = new Date().toLocaleDateString("zh-TW");

  return (
    <>
      <Head>
        <title>隱私權政策 | {CONTACT_INFO.siteName}</title>
        <meta
          name="description"
          content={`${CONTACT_INFO.siteName} 的隱私權政策說明。`}
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-gray-800 font-sans">
        {/* 頁面標題 */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
            隱私權政策
          </h1>
          <p className="text-gray-500 text-sm">最後更新日期：{currentDate}</p>
        </div>

        {/* 政策內容 */}
        <div className="space-y-8 leading-relaxed">
          {/* 1. 前言 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              1. 前言
            </h2>
            <p className="mb-2">
              歡迎蒞臨 {CONTACT_INFO.siteName}（以下簡稱「本網站」），本網站由{" "}
              {CONTACT_INFO.companyName}（以下簡稱「本公司」）經營。
              我們非常重視您的隱私權，並致力於保護您的個人資料。本隱私權政策將說明我們如何收集、使用、揭露及保護您的資訊。
            </p>
            <p>
              當您使用本網站的服務（包括但不限於瀏覽商品、註冊會員、委託代購或寄賣服務）時，即表示您同意本政策所述之內容。
            </p>
          </section>

          {/* 2. 資料收集 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              2. 我們收集的資料
            </h2>
            <p className="mb-2">
              為了提供完整的精品交易與鑑定服務，我們可能會收集以下類型的資料：
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1 text-gray-700">
              <li>
                <strong>個人識別資料：</strong>{" "}
                姓名、電子郵件地址、聯絡電話、出生日期（用於會員權益）。
              </li>
              <li>
                <strong>交易與物流資料：</strong>{" "}
                配送地址、帳單地址、信用卡資訊（僅透過加密金流服務處理，本網站不直接儲存卡號）、購買紀錄。
              </li>
              <li>
                <strong>寄賣與鑑定資料：</strong>{" "}
                若您使用寄賣服務，我們可能需要收集您的身分證件影本或匯款帳號，以符合法規與撥款需求。
              </li>
              <li>
                <strong>數位足跡：</strong> IP
                位址、瀏覽器類型、裝置資訊、Cookie 及使用行為數據。
              </li>
            </ul>
          </section>

          {/* 3. 資料使用目的 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              3. 資料使用目的
            </h2>
            <p className="mb-2">我們收集的資料將用於以下用途：</p>
            <ul className="list-disc list-inside ml-2 space-y-1 text-gray-700">
              <li>處理您的訂單、代購需求與退換貨事宜。</li>
              <li>進行商品真偽鑑定流程的紀錄與建檔。</li>
              <li>
                提供客戶服務，回覆您的詢問（如：Line 官方帳號或 Email 諮詢）。
              </li>
              <li>發送會員專屬優惠、新品通知或電子報（您可隨時取消訂閱）。</li>
              <li>優化網站體驗與防範詐欺行為。</li>
            </ul>
          </section>

          {/* 4. 資料分享與第三方 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              4. 資料分享與第三方揭露
            </h2>
            <p className="mb-2">
              除法律規定或司法單位要求外，我們絕不會將您的個人資料販售給第三方。但在以下必要情況下，我們可能會與合作夥伴分享您的部分資訊：
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1 text-gray-700">
              <li>
                <strong>物流合作夥伴：</strong>{" "}
                為了將商品送達，需提供姓名、電話與地址給物流公司。
              </li>
              <li>
                <strong>金流服務商：</strong> 處理信用卡或行動支付交易。
              </li>
              <li>
                <strong>系統維護商：</strong>{" "}
                協助網站營運與技術支援的服務提供者（均簽署保密協議）。
              </li>
            </ul>
          </section>

          {/* 5. Cookie 技術 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              5. Cookie 技術
            </h2>
            <p>
              本網站使用 Cookie
              以優化您的瀏覽體驗（例如：記住您的購物車內容、保持登入狀態）。您可以透過瀏覽器設定拒絕
              Cookie，但這可能會導致網站部分功能無法正常運作。
            </p>
          </section>

          {/* 6. 資料安全 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              6. 資料安全
            </h2>
            <p>
              我們採用符合業界標準的 SSL
              加密技術來傳輸您的敏感資料。儘管網際網路傳輸無法保證 100%
              安全，但我們致力於採取所有合理措施來保護您的資訊安全。
            </p>
          </section>

          {/* 7. 當事人權利 */}
          <section>
            <h2 className="text-xl font-bold mb-3 border-l-4 border-black pl-3">
              7. 您的權利
            </h2>
            <p className="mb-2">根據個人資料保護法，您擁有以下權利：</p>
            <ul className="list-disc list-inside ml-2 space-y-1 text-gray-700">
              <li>查詢或請求閱覽您的個人資料。</li>
              <li>請求補充或更正您的個人資料。</li>
              <li>請求停止蒐集、處理或利用，以及請求刪除您的個人資料。</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              若欲行使上述權利，請透過下方聯絡方式與我們聯繫，我們將於法定期間內處理。
            </p>
          </section>

          {/* 8. 聯絡我們 */}
          <section className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-bold mb-3">8. 聯絡我們</h2>
            <p className="mb-4">
              若您對本隱私權政策有任何疑問，或希望行使您的權利，歡迎隨時聯繫我們：
            </p>
            <div className="space-y-2 text-gray-800">
              <p>
                <strong>公司名稱：</strong> {CONTACT_INFO.companyName}
              </p>
              <p>
                <strong>客服信箱：</strong>{" "}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p>
                <strong>客服專線：</strong> {CONTACT_INFO.phone}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
