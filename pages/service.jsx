"use client";
import React, { useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";

// --- 共用資料：需備文件與線上須知 ---
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
    desc: "追求最高回報的選擇。將商品交由我們專業展示與銷售，成交後收取手續費。",
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
        a: "不會。CIÉMAN 門市採預約制或嚴格控管，高單價商品皆展示於櫃內，僅由服務人員配戴手套展示。",
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
        desc: "在 CIÉMAN 挑選您想換購的目標商品。",
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
};

export default function Services() {
  const [activeTab, setActiveTab] = useState("buy-in");

  return (
    <ReactLenis root>
      <div className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* 標題區 */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
              Our Services
            </h1>
            <p className="text-gray-500 font-light">
              CIÉMAN 提供全方位的精品資產管理服務
            </p>
          </div>

          {/* Tab 切換按鈕 */}
          <div className="flex justify-center mb-16 border-b border-gray-100">
            {Object.keys(servicesData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 px-6 md:px-10 text-sm md:text-base tracking-widest uppercase transition-all relative ${
                  activeTab === key
                    ? "text-black font-medium"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {servicesData[key].title.split(" ")[0]} {/* 只顯示中文標題 */}
                <span className="hidden md:inline ml-2 text-xs opacity-60">
                  {servicesData[key].title.split(" ")[1]}
                </span>
                {/* 底部動態線條 */}
                {activeTab === key && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                  />
                )}
              </button>
            ))}
          </div>

          {/* 內容顯示區 (使用 AnimatePresence 做切換動畫) */}
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
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-serif mb-4">
                  {servicesData[activeTab].title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {servicesData[activeTab].desc}
                </p>
                {servicesData[activeTab].highlight && (
                  <div className="inline-block bg-gray-900 text-white px-4 py-2 text-sm tracking-wide">
                    {servicesData[activeTab].highlight}
                  </div>
                )}
              </div>

              {/* 2. 流程圖示意 (Process Diagram) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* 裝飾線 (僅桌面版顯示) */}
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

              {/* 3. 需備資料與線上說明 (Grid Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gray-50 p-8 md:p-12 rounded-sm">
                {/* 左側：門市現場 */}
                <div>
                  <h4 className="flex items-center text-lg font-medium mb-6">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    門市現場買賣需備
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
                          <span className="text-gray-400 mr-2">✓</span> {item}
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

              {/* 4. 常見問答 FAQ */}
              <div>
                <h3 className="text-xl font-serif mb-8 text-center">
                  FAQ 常見問答
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {servicesData[activeTab].faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-100 p-6 hover:shadow-sm transition-shadow"
                    >
                      <p className="font-medium text-black mb-3">Q. {item.q}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        A. {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 底部 CTA */}
          <div className="mt-20 text-center">
            <p className="text-gray-500 mb-6">準備好開始了嗎？</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://line.me/ti/p/@yourid"
                target="_blank"
                className="bg-[#06c755] text-white px-8 py-3 text-sm tracking-widest hover:bg-[#05b34c] transition-colors"
              >
                LINE 線上估價
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
