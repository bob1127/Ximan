import React from "react";
import Head from "next/head";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";

// 動畫設定
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Authenticity() {
  // --- 依照截圖設定 SEO (一字不差) ---
  const pageTitle = "正品保證 | Authenticity & Standards";
  const pageDesc =
    "於 KÉSH de¹ 購買之商品，皆經專業鑑定並附相關鑑定文件與購買憑證，終身正品保障。自購買日起兩年內，提供一次免費皮革基礎保養與清潔服務（不含五金零件及皮革修復或更換）。";

  // --- 結構化資料 ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDesc,
    publisher: {
      "@type": "Organization",
      name: "KÉSH de¹ 凱仕國際精品",
    },
  };

  return (
    <ReactLenis root>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <div className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* 1. 頁面標題區 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-gray-900">
              Authenticity & Standards
            </h1>
            <p className="text-gray-500 font-light tracking-wider">
              正品保證與鑑定標準
            </p>
          </motion.div>

          {/* 2. 核心承諾 (呼應 Description) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gray-50 p-8 md:p-12 mb-16 border border-gray-100"
          >
            <h3 className="text-xl font-serif mb-6 text-center">
              我們對真實性的承諾
            </h3>
            <p className="text-gray-600 leading-loose text-justify md:text-center mb-8">
              {/* 這裡直接包含 SEO Description 的關鍵字，讓 Google 知道內容相關 */}
              於 KÉSH de¹ 購買之商品，皆經兩位合格鑑定師人工審核，並搭配 Entrupy
              科技驗證， 附相關鑑定文件與購買憑證，提供
              <span className="font-bold text-black mx-1">終身正品保障</span>。
              我們深知，信任是精品交易的基石。
            </p>
            <div className="flex justify-center gap-4">
              {/* 示意標章 */}
              <span className="px-4 py-2 bg-black text-white text-xs tracking-widest uppercase">
                Entrupy Verified
              </span>
              <span className="px-4 py-2 border border-black text-black text-xs tracking-widest uppercase">
                Double Authentication
              </span>
            </div>
          </motion.div>

          {/* 3. 詳細服務條款 */}
          <div className="space-y-16">
            {/* 區塊 A: 鑑定流程 */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-serif mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-black mr-4"></span>
                嚴謹鑑定流程
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-black mb-3">01. 科學驗證</h4>
                  <p>
                    採用 Entrupy
                    人工智慧鑑定系統，透過顯微鏡頭分析皮革紋路與工藝細節，比對全球數據庫，準確率高達
                    99.1%。
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-3">02. 專家把關</h4>
                  <p>
                    每一件商品皆須經過內部兩位資深鑑定師獨立查驗，確認字體、五金、縫線符合品牌工藝標準。
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-3">03. 完整履歷</h4>
                  <p>
                    隨貨附上 KÉSH de¹
                    專屬保證卡與相關鑑定報告，建立商品完整履歷，讓您收藏無後顧之憂。
                  </p>
                </div>
              </div>
            </motion.section>

            {/* 區塊 B: 保養服務 (對應 SEO Description 後半段) */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <h2 className="text-2xl font-serif mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-black mr-4"></span>
                售後保養服務
              </h2>
              <div className="bg-[#1A1A1A] text-[#F6F1EB] p-8 md:p-10 rounded-sm">
                <h4 className="text-lg font-medium mb-4">專屬皮革護理</h4>
                <p className="leading-relaxed font-light opacity-90 mb-6">
                  {/* 重複關鍵字以強化 SEO */}
                  自購買日起兩年內，憑購買證明，我們提供
                  <span className="border-b border-white/30 pb-1">
                    一次免費皮革基礎保養與清潔服務
                  </span>
                  。 讓您的愛包在專業護理下，延續其迷人光澤。
                </p>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                  <li>本服務包含：皮革表面除塵、滋潤保養、基礎護理。</li>
                  <li>
                    除外項目：不含五金零件拋光/更換、皮革破損修復、內裡更換或染色服務。
                  </li>
                  <li>使用方式：請提前預約並攜帶保證卡至門市辦理。</li>
                </ul>
              </div>
            </motion.section>
          </div>

          {/* 底部聯繫 */}
          <div className="mt-24 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-4">
              對商品真偽或保養有任何疑問？
            </p>
            <a
              href="/contact"
              className="text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
            >
              聯繫客服團隊
            </a>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
