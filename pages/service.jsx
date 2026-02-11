import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

// --- 各服務詳細資料 ---
const servicesData = {
  "buy-in": {
    title: "收購流程 Buy-in",
    desc: "最快速的變現方式。我們提供具競爭力的市場報價，現場確認無誤即刻撥款。",
    steps: [
      {
        step: "01",
        title: "初步估價",
        desc: "透過 LINE 線上傳送照片，或直接攜帶商品至門市。",
      },
      {
        step: "02",
        title: "實品鑑定",
        desc: "專業鑑定師現場確認包況、配件與真偽。",
      },
      {
        step: "03",
        title: "簽署合約",
        desc: "雙方確認價格與物品狀況，簽署買賣讓渡書。",
      },
      {
        step: "04",
        title: "現金撥款",
        desc: "完成手續，立即現金支付或匯款轉帳。",
      },
    ],
    pricing:
      "依據品牌、款式熱門度、當前二手市場行情及商品實際保存狀況（年份、磨損、配件完整度）進行綜合鑑價。",
    faq: [
      {
        q: "收購價格與寄賣價格有差嗎？",
        a: "有的。收購由店方承擔庫存風險，價格通常會略低於寄賣；優點是能立即拿到現金，不需等待銷售期。",
      },
      {
        q: "沒有購買證明可以收購嗎？",
        a: "可以。但部分特定品牌或款式（如 Chanel 雷標款、Hermes）若無配件可能會影響收購價格，建議盡量附上。",
      },
    ],
  },
  consignment: {
    title: "寄賣流程 Consignment",
    desc: "協助您為閒置精品包款進行合理定價並上架寄賣。從合約簽訂、銷售到成交收款，流程透明清楚，讓精品在安心與信任中找到下一位收藏者。",
    highlight: "手續費為最終成交金額的 20%（含稅金）",
    steps: [
      {
        step: "01",
        title: "制定售價",
        desc: "雙方討論並協議合理的上架販售金額。",
      },
      {
        step: "02",
        title: "簽署合約",
        desc: "確認寄賣期間（通常為 3-6 個月）與保管條款。",
      },
      {
        step: "03",
        title: "專業上架",
        desc: "商品清潔整理、專業攝影、官網與社群曝光。",
      },
      {
        step: "04",
        title: "售出撥款",
        desc: "商品售出後，扣除 20% 手續費，於約定時間內匯款給您。",
      },
    ],
    pricing:
      "我們會提供專業建議售價，但最終定價權在於您。若定價過高導致長期滯銷，我們會與您討論適度調整價格。",
    faq: [
      {
        q: "寄賣期間可以取回商品嗎？",
        a: "可以。若在合約期內取回，可能需支付少許整新保管費；合約期滿未售出則可免費取回。",
      },
      {
        q: "寄賣商品會被隨意觸摸嗎？",
        a: "不會。KÉSH de¹ 門市採預約制或嚴格控管，高單價商品皆展示於櫃內，僅由服務人員配戴手套展示。",
      },
    ],
  },
  "trade-in": {
    title: "置換流程 Trade-in",
    desc: "以舊換新，讓收藏流動。用您手邊的閒置精品，折抵換購店內的心儀款式。",
    steps: [
      {
        step: "01",
        title: "挑選商品",
        desc: "在 KÉSH de¹ 挑選您想換購的目標商品。",
      },
      {
        step: "02",
        title: "舊包鑑價",
        desc: "我們評估您帶來的舊包價值（通常高於直接收購價）。",
      },
      {
        step: "03",
        title: "補足差額",
        desc: "計算「新包價格」減去「舊包抵價」，您僅需支付差額。",
      },
      {
        step: "04",
        title: "完成交換",
        desc: "一次完成出清與入手，享受升級樂趣。",
      },
    ],
    pricing:
      "置換服務通常能為您的舊包爭取到比「直接收購」更優惠的折抵價格，作為我們鼓勵循環時尚的回饋。",
    faq: [
      {
        q: "可以多個包換一個包嗎？",
        a: "可以。您可以使用多個閒置商品累計金額，來換購一個高單價商品。",
      },
      {
        q: "如果舊包價值高於新包怎麼辦？",
        a: "若舊包價值較高，我們會將差額以現金或匯款方式退還給您。",
      },
    ],
  },
  sourcing: {
    title: "代購服務 Sourcing",
    desc: "提供專業精品代購與尋款服務，依照您的需求協助尋找合適款式，價格與等待時間清楚說明，確保每一次代購都安心無虞。",
    highlight: "全球專櫃與合法通路採購｜100% 正品保證",
    intro: [
      "如果您在 KÉSH de¹ 找不到想要的款式，我們提供全球精品專櫃與國際通路新品代購服務。",
      "所有商品皆由 KÉSH 專業團隊向國際專櫃或合法精品通路採購，到貨後皆經專業鑑定、建檔與拍攝存證，完成後方安排出貨。",
      "專注品牌：Hermès、Chanel、Louis Vuitton、Dior、Loewe、Celine、Prada (其他品牌亦可協助)。",
    ],
    suitableFor: [
      "官網找不到想要的款式",
      "專櫃缺貨、排不到配貨",
      "尋找當季新品或限量款",
      "指定顏色、尺寸或材質",
      "收藏級全新商品需求",
      "希望省去跨國購買與通關麻煩",
    ],
    steps: [
      {
        step: "01",
        title: "需求確認",
        desc: "填寫代購表單，專人聯繫確認款式與細節。",
      },
      {
        step: "02",
        title: "報價與付款",
        desc: "提供正式報價與交期，確認後需支付 100% 全額款項。",
      },
      {
        step: "03",
        title: "全球採購",
        desc: "啟動國際專櫃與通路採購，全程回報進度。",
      },
      {
        step: "04",
        title: "鑑定出貨",
        desc: "到貨後經專業鑑定建檔，安排配送給您。",
      },
    ],
    formInfo: [
      "姓名 / 電話 / Email",
      "欲代購品牌 / 型號 / 顏色 / 尺寸",
      "商品狀態需求 (全新 / 近全新 / 9成新 / 可接受小瑕疵)",
    ],
    paymentPolicy: {
      title: "付款制度 (全額預付制)",
      content:
        "訂單成立後需一次性支付商品總金額 100%。KÉSH 所有代購訂單皆由第三方支付平台 Unipay 代為收款與管理金流，確保交易流程透明安全。",
    },
    refundPolicy: {
      title: "缺貨退款保障 (信任機制)",
      content:
        "若因專櫃缺貨、停產、官方下架等因素導致無法完成採購，KÉSH 將透過 Unipay 於 3-5 個工作天內全額退款 (含原支付金額)，不收取任何手續費。",
    },
    legalNote:
      "代購屬於「依消費者指定需求進行採購之客製化商品」，依《消費者保護法》第19條規定，不適用七日鑑賞期，訂單成立並付款後除缺貨外恕無法取消或退換貨。",
    shipping:
      "國際專櫃現貨約 7-14 工作天；歐洲通路約 14-21 工作天；特殊款依實際回覆為準。",
  },
};

// --- 共用資料 ---
const COMMON_REQUIREMENTS = {
  inStore: [
    "本人雙證件（身分證 + 健保卡／駕照）",
    "商品完整配件（盒、塵袋、購證、卡片、肩帶等）",
  ],
  online: [
    "商品清晰照片（正面／背面／底部／四角／五金／內裡／瑕疵處）",
    "聯絡方式（手機號碼 + LINE ID）",
  ],
  privacyNote: "提醒：所有證件資料僅用於身分確認並依隱私政策妥善保護。",
};

export default function Services() {
  const router = useRouter(); // [SEO優化] 1. 引入 Router
  const [activeTab, setActiveTab] = useState("buy-in");

  // [SEO優化] 2. 監聽 URL 參數變化，自動切換 Tab
  // 這樣 Google 爬蟲或是用戶分享連結 (e.g. /services?tab=consignment) 時能直接看到對應內容
  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const tabParam = router.query.tab;
      if (servicesData[tabParam]) {
        setActiveTab(tabParam);
      }
    }
  }, [router.isReady, router.query.tab]);

  // [SEO優化] 3. 切換 Tab 時同步修改 URL (Shallow routing 不刷新頁面)
  const handleTabChange = (key) => {
    setActiveTab(key);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: key },
      },
      undefined,
      { shallow: true },
    );
  };

  // --- SEO 與 Meta 設定 (根據截圖修改) ---
  const siteUrl = "https://www.kesh-de1.com";
  // [SEO更新] Title 與截圖一致
  const pageTitle = "收購・寄售・置換・專屬尋款 | Services";
  // [SEO更新] Description 與截圖一致 (法律/實名驗證取向)
  const pageDesc =
    "申請上述服務者須提供有效之雙重身分證明文件（身分證及第二證件，如健保卡、駕照或護照）以完成實名驗證。資料僅作身份驗證及法規遵循之用途，不另作他用。";

  // --- 結構化資料 1: Service (服務列表) ---
  // [結構化更新] 加入了 'url' 屬性指向特定參數網址，幫助生成 Sitelinks
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Luxury Goods Trading Services",
    provider: {
      "@type": "Organization",
      name: "KÉSH de¹ 凱仕國際精品",
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
    },
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
    },
    // [結構化更新] 這裡的 name 和 description 也要跟著 Meta 改，保持一致性
    name: "KÉSH de¹ 精品服務流程",
    description: pageDesc,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "KÉSH de¹ Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "精品收購 Buy-in",
            description:
              "提供具競爭力的市場報價，現場確認無誤即刻撥款，最快速的變現方式。",
            url: `${siteUrl}/services?tab=buy-in`, // [關鍵優化] 指向具體參數
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "精品寄賣 Consignment",
            description:
              "協助您為閒置精品包款進行合理定價並上架寄賣。從合約簽訂、銷售到成交收款，流程透明清楚。",
            url: `${siteUrl}/services?tab=consignment`, // [關鍵優化]
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "以舊換新 Trade-in",
            description:
              "用您手邊的閒置精品，折抵換購店內的心儀款式，讓收藏流動。",
            url: `${siteUrl}/services?tab=trade-in`, // [關鍵優化]
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "精品代購 Sourcing",
            description:
              "提供專業精品代購與尋款服務，依照您的需求協助尋找合適款式，100% 正品保證。",
            url: `${siteUrl}/services?tab=sourcing`, // [關鍵優化]
          },
        },
      ],
    },
  };

  // --- 結構化資料 2: FAQPage (問答集) ---
  const allFaqs = [
    ...(servicesData["buy-in"].faq || []),
    ...(servicesData["consignment"].faq || []),
    ...(servicesData["trade-in"].faq || []),
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // --- 結構化資料 3: Breadcrumb (麵包屑) ---
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "服務流程",
        item: `${siteUrl}/services`,
      },
    ],
  };

  return (
    <ReactLenis root>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta
          name="keywords"
          content="精品收購, 二手包寄賣, 精品代購, 愛馬仕代購, 香奈兒收購, LV寄賣, 精品置換, KESH de1"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${siteUrl}/services`} />
        <meta property="og:site_name" content="KÉSH de¹ 凱仕國際精品" />
        <meta property="og:image" content={`${siteUrl}/images/og-image.jpg`} />

        {/* JSON-LD Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <div className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* 標題區 */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
              Our Services
            </h1>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              {/* 更新為符合 Description 的法律聲明提示，增加一致性 */}
              為確保交易安全與合規，申請服務前請詳閱身分驗證需求。
            </p>
          </div>

          {/* Tab 切換按鈕 */}
          <div className="flex flex-wrap justify-center mb-16 border-b border-gray-100">
            {Object.keys(servicesData).map((key) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)} // [更新] 使用新的切換函數
                className={`pb-4 px-4 md:px-10 text-sm md:text-base tracking-widest uppercase transition-all relative ${
                  activeTab === key
                    ? "text-black font-medium"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {servicesData[key].title.split(" ")[0]}
                <span className="hidden md:inline ml-2 text-xs opacity-60">
                  {servicesData[key].title.split(" ")[1]}
                </span>
                {activeTab === key && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                  />
                )}
              </button>
            ))}
          </div>

          {/* 內容顯示區 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* 1. 服務簡介 */}
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-serif mb-4">
                  {servicesData[activeTab].title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {servicesData[activeTab].desc}
                </p>
                {servicesData[activeTab].highlight && (
                  <div className="inline-block bg-gray-900 text-white px-4 py-2 text-sm tracking-wide mb-6">
                    {servicesData[activeTab].highlight}
                  </div>
                )}

                {/* Sourcing 特有的 Intro 區塊 */}
                {activeTab === "sourcing" && (
                  <div className="text-left md:text-center text-sm text-gray-500 space-y-2 mb-8">
                    {servicesData.sourcing.intro.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. 流程圖示意 (Process Diagram) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-6 left-0 w-full h-[1px] bg-gray-100 -z-10" />
                {servicesData[activeTab].steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white pt-0 md:pt-6 relative group"
                  >
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-sm font-bold mb-6 mx-auto md:mx-0 rounded-sm">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-center md:text-left">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed text-center md:text-left">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* 3. 詳細資訊區塊 */}
              {activeTab === "sourcing" ? (
                // --- Sourcing 專屬詳細內容 ---
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gray-50 p-8 md:p-12 rounded-sm">
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                        適合哪些貴賓？
                      </h4>
                      <ul className="space-y-3">
                        {servicesData.sourcing.suitableFor.map((item, i) => (
                          <li
                            key={i}
                            className="text-gray-600 text-sm flex items-start"
                          >
                            <span className="text-gray-400 mr-2">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        代購需求表單資訊
                      </h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="font-bold mb-2">
                          請準備以下資料，我們將於 24 小時內聯繫：
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-4">
                          {servicesData.sourcing.formInfo.map((info, i) => (
                            <li key={i}>{info}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-gray-100 p-6">
                      <h4 className="font-bold text-black mb-3">付款制度</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {servicesData.sourcing.paymentPolicy.content}
                      </p>
                    </div>
                    <div className="border border-gray-100 p-6">
                      <h4 className="font-bold text-black mb-3">
                        缺貨退款保障
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {servicesData.sourcing.refundPolicy.content}
                      </p>
                    </div>
                    <div className="border border-gray-100 p-6">
                      <h4 className="font-bold text-black mb-3">法規與交期</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mb-2">
                        <span className="font-bold text-xs bg-gray-100 px-1">
                          法律
                        </span>{" "}
                        {servicesData.sourcing.legalNote}
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        <span className="font-bold text-xs bg-gray-100 px-1">
                          交期
                        </span>{" "}
                        {servicesData.sourcing.shipping}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900 text-white p-6 md:p-8 rounded-sm text-center">
                    <h4 className="text-lg font-serif mb-4">我們的承諾</h4>
                    <p className="text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto opacity-90">
                      KÉSH de¹
                      僅協助代購來源透明、可驗證之正規商品，所有商品皆經專業鑑定師檢查，並建立完整商品履歷。我們不只是幫您買到一個包，而是替您完成一個重要的收藏決定。
                    </p>
                  </div>
                </div>
              ) : (
                // --- Buy-in, Consignment, Trade-in 共用詳細內容 ---
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gray-50 p-8 md:p-12 rounded-sm">
                    {/* 左側：門市現場 */}
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                        門市現場需備
                      </h4>
                      <ul className="space-y-3">
                        {COMMON_REQUIREMENTS.inStore.map((item, i) => (
                          <li
                            key={i}
                            className="text-gray-600 text-sm flex items-start"
                          >
                            <span className="text-gray-400 mr-2">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-6 text-xs text-gray-400 border-t border-gray-200 pt-4">
                        {COMMON_REQUIREMENTS.privacyNote}
                      </p>
                    </div>

                    {/* 右側：線上初估 & 價格評估 */}
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        線上初估與鑑價
                      </h4>
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 font-bold mb-2">
                          需提供資料：
                        </p>
                        <ul className="space-y-2">
                          {COMMON_REQUIREMENTS.online.map((item, i) => (
                            <li
                              key={i}
                              className="text-gray-600 text-sm flex items-start"
                            >
                              <span className="text-gray-400 mr-2">✓</span>{" "}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-bold mb-2">
                          價格評估方式：
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {servicesData[activeTab].pricing}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 常見問答 FAQ */}
                  {servicesData[activeTab].faq && (
                    <div className="mt-16">
                      <h3 className="text-xl font-serif mb-8 text-center">
                        FAQ 常見問答
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        {servicesData[activeTab].faq.map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-100 p-6 hover:shadow-sm transition-shadow"
                          >
                            <p className="font-medium text-black mb-3">
                              Q. {item.q}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              A. {item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 底部 CTA */}
          <div className="mt-20 text-center border-t border-gray-100 pt-16">
            <p className="text-gray-500 mb-6">
              {activeTab === "sourcing"
                ? "尋找夢幻逸品？立即聯繫我們"
                : "準備好開始了嗎？"}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="https://line.me/ti/p/@yourid"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#06c755] text-white px-8 py-3 text-sm tracking-widest hover:bg-[#05b34c] transition-colors"
              >
                LINE 線上{activeTab === "sourcing" ? "諮詢代購" : "估價"}
              </a>
              <a
                href="/contact"
                className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors"
              >
                預約門市鑑賞
              </a>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
