import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Link from "next/link";

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
        q: "什麼是收購 (Buy-in)？",
        a: "收購是指由本公司直接買斷商品，經雙方確認價格後，即不再屬於合作銷售或上架代售模式，商品所有權將轉移予本公司。",
      },
      {
        q: "收購價格是如何評估的？",
        a: "收購價格將依商品品牌、款式市場需求、當前市場行情，以及商品實際保存狀況（包含年份、使用痕跡與配件完整度）進行綜合評估後提出報價。",
      },
      {
        q: "確認收購後，流程與撥款方式為何？",
        a: "雙方確認價格並達成共識後，將以線上方式完成收購確認文件並請您將商品寄送至本公司指定地址。\n\n商品收件後，本公司將依實際商品狀態進行檢視；若實際狀態與事前提供之照片或資訊存在明顯差異，將第一時間與賣方聯繫說明並於雙方達成共識後，視情況調整收購價格或終止收購流程。\n\n商品狀態確認無誤後，將於 7 個工作天內完成款項撥付。",
      },
      {
        q: "商品狀態與描述不符，會發生什麼情況？",
        a: "若實際商品狀態與提交資料有明顯落差，我們將即時與您聯繫說明，並重新確認是否調整價格或終止收購流程。",
      },
      {
        q: "商品完成收購後，是否還能反悔或取回？",
        a: "收購完成並確認付款後，商品即完成所有權轉移，恕不再提供取回或取消收購之服務。",
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
        q: "商品售出後，款項多久可以收到？",
        a: "商品完成交易並確認無退貨情形後，預計7-14天內撥款，售出後我們會主動告知您，並告知預計撥款時間，流程透明可查。",
      },
      {
        q: "平台服務費包含哪些內容？",
        a: "平台服務費已包含商品價格評估、拍攝、上架曝光、銷售處理寄送服務與售後協助等必要成本，無額外隱藏費用。",
      },
      {
        q: "我想寄賣的商品是否一定能被上架銷售？",
        a: "不一定。本平台僅接受保存狀況良好且來源正當之商品。所有商品皆須經本公司專業團隊進行審核，評估市場適配度。未通過審核之商品，將不會進入上架銷售流程。",
      },
      {
        q: "商品價格是誰決定？會被隨意降價嗎？",
        a: "商品上架價格將於合作前經雙方確認後設定，未經同意不會自行調整售價，任何價格建議或市場調整，皆會事前與商品提供方溝通。",
      },
      {
        q: "商品在合作期間如何保存？會不會刮傷或變形？",
        a: "所有商品皆依精品保存標準妥善管理，包含防塵、防壓與環境控管措施，並避免不必要的移動與堆疊，確保商品維持原有保存狀態。",
      },
      {
        q: "為什麼需要提供身分驗證資料？",
        a: "身分驗證僅用於確認合作對象與交易安全，符合相關法規與平台合規需求，不作為其他用途。",
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
        q: "什麼是置換 (Trade-in)？",
        a: "置換是指以您現有之精品商品，折抵本平台商品之部分金額，以完成換購流程。折抵金額將依商品評估結果計算，並套用於指定商品或訂單。",
      },
      {
        q: "是否所有商品都適合進行置換？",
        a: "不一定。僅限保存狀況良好、具市場流通性之精品進行評估。實際是否適用，仍需經本團隊鑑定團隊審核。",
      },
      {
        q: "如果舊包價值高於新包怎麼辦？",
        a: "若舊包評估價值高於換購商品金額，多出的金額將保留為平台折抵額度，可彈性使用於未來換購或消費。",
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
    faq: [
      {
        q: "你們的代購商品來源是哪裡？",
        a: "所有代購商品皆透過合法且可信的國際採購取得，包含品牌專櫃、及授權之零售商，確保來源正當且可追溯。",
      },
      {
        q: "為什麼代購需要先付款？",
        a: "代購屬於依需求專屬採購服務，商品需依客戶指定條件進行尋找與下單，因此需於確認報價後完成付款，以確保採購流程順利進行。",
      },
      {
        q: "代購商品是否接受退換？",
        a: "代購服務屬於依客戶需求進行之專屬採購，恕不提供取消或退換服務。建議於確認款式、尺寸與細節後再委託代購。",
      },
      {
        q: "你們會提供購證或相關文件嗎？",
        a: "代購確認後，本店將提供相應之代購確認文件，以保障雙方權益。如品牌通路有提供相關文件，將一併隨貨附上；實際附屬文件內容，將依各品牌與採購通路之規範為準。",
      },
      {
        q: "大約需要多久可以收到商品？",
        a: "實際到貨時間將依商品來源地與採購進度而有所不同。於確認代購後，我們將提供預估時程，並持續回報進度。",
      },
      {
        q: "如果找不到指定商品，會怎麼處理？",
        a: "若商品缺貨、停產或其他不可控因素導致無法完成採購，將主動通知並依約定方式處理後續安排退款。",
      },
    ],
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy-in");

  // 監聽 URL 參數變化，自動切換 Tab
  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const tabParam = router.query.tab;
      if (servicesData[tabParam]) {
        setActiveTab(tabParam);
      }
    }
  }, [router.isReady, router.query.tab]);

  // 切換 Tab 時同步修改 URL
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

  const siteUrl = "https://www.kesh-de1.com";
  const pageTitle = "收購・寄售・置換・專屬尋款 | Services";
  const pageDesc =
    "申請上述服務者須提供有效之雙重身分證明文件（身分證及第二證件，如健保卡、駕照或護照）以完成實名驗證。資料僅作身份驗證及法規遵循之用途，不另作他用。";

  // 結構化資料... (保持不變)
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
            url: `${siteUrl}/services?tab=buy-in`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "精品寄賣 Consignment",
            description:
              "協助您為閒置精品包款進行合理定價並上架寄賣。從合約簽訂、銷售到成交收款，流程透明清楚。",
            url: `${siteUrl}/services?tab=consignment`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "以舊換新 Trade-in",
            description:
              "用您手邊的閒置精品，折抵換購店內的心儀款式，讓收藏流動。",
            url: `${siteUrl}/services?tab=trade-in`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "精品代購 Sourcing",
            description:
              "提供專業精品代購與尋款服務，依照您的需求協助尋找合適款式，100% 正品保證。",
            url: `${siteUrl}/services?tab=sourcing`,
          },
        },
      ],
    },
  };

  const allFaqs = [
    ...(servicesData["buy-in"].faq || []),
    ...(servicesData["consignment"].faq || []),
    ...(servicesData["trade-in"].faq || []),
    ...(servicesData["sourcing"].faq || []),
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
              為確保交易安全與合規，申請服務前請詳閱身分驗證需求。
            </p>
          </div>

          {/* Tab 切換按鈕 */}
          <div className="flex flex-wrap justify-center mb-16 border-b border-gray-100">
            {Object.keys(servicesData).map((key) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
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

                  {/* 代購 FAQ */}
                  {servicesData.sourcing.faq && (
                    <div className="mt-16">
                      <h3 className="text-xl font-serif mb-8 text-center">
                        FAQ 常見問答
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        {servicesData.sourcing.faq.map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-100 p-6 hover:shadow-sm transition-shadow"
                          >
                            <p className="font-medium text-black mb-3">
                              Q.{" "}
                              {item.q
                                .replace("Q.", "")
                                .replace("Q1.", "")
                                .replace("Q7.", "")
                                .trim()}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                              A. {item.a.replace("A.", "").trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-900 text-white p-6 md:p-8 rounded-sm text-center mt-12">
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
                    {/* 左側：線上提交須知 (修改自 門市現場需備) */}
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-[#ef4628] rounded-full mr-3"></span>
                        線上提交須知
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
                              Q. {item.q.replace("Q.", "").trim()}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                              A. {item.a.replace("A.", "").trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 收購/寄賣/置換 共用結語區塊 */}
                  <div className="mt-16 pt-12 border-t border-gray-200 text-center max-w-2xl mx-auto space-y-6">
                    <p className="text-[#ef4628] font-bold tracking-wide">
                      收購與合作銷售服務：
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      為確保評估結果準確並使流程順利進行，
                      <br className="hidden md:block" />
                      請提供清晰、完整且能如實反映商品實際狀態之資訊與照片。
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      如有任何流程或細節需要進一步說明，
                      <br className="hidden md:block" />
                      歡迎隨時與我們聯繫，我們將樂意協助。
                    </p>
                    <div className="pt-4">
                      <Link
                        href="/contact"
                        className="inline-block border-b-2 border-black pb-1 text-sm font-bold tracking-widest hover:text-[#ef4628] hover:border-[#ef4628] transition-colors"
                      >
                        聯繫客服團隊
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 底部 CTA 按鈕區 */}
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
              <Link
                href="/contact"
                className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors"
              >
                {activeTab === "sourcing" ? "提交代購需求" : "預約門市鑑賞"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
