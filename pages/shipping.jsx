import React from "react";
import Head from "next/head";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Shipping() {
  // --- 依照截圖設定 SEO ---
  const pageTitle = "全球配送 | Worldwide Shipping";
  // 注意：這裡包含了英文描述，這對 Google 抓取非常重要
  const pageDesc =
    "提供全球配送服務，並依目的地國家規定辦理相關清關流程。我們致力於確保配送安全與效率。We provide international shipping. Documentation is prepared in accordance with destination regulations. Delivery is handled securely and efficiently.";

  return (
    <ReactLenis root>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
      </Head>

      <div className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* 1. 標題 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-gray-900">
              Worldwide Shipping
            </h1>
            <p className="text-gray-500 font-light tracking-wider">
              全球配送政策
            </p>
          </motion.div>

          {/* 2. 中英文對照區塊 (呼應 SEO Description) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="grid md:grid-cols-2 gap-10 mb-20 items-start"
          >
            {/* 中文 */}
            <div>
              <h3 className="text-lg font-medium mb-4">配送承諾</h3>
              <p className="text-gray-600 leading-loose text-justify">
                KÉSH de¹
                提供全球配送服務。無論您身在何處，我們都致力於確保每一件精品能安全、高效地送達您手中。我們與國際頂尖物流夥伴（DHL
                / FedEx）合作，並依目的地國家規定協助辦理相關清關流程。
              </p>
            </div>
            {/* 英文 (對應截圖中的英文描述) */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="text-lg font-medium mb-4 font-serif">
                International Policy
              </h3>
              <p className="text-gray-500 leading-loose text-sm font-light">
                We provide international shipping services. Documentation is
                prepared strictly in accordance with destination country
                regulations. Delivery is handled securely and efficiently
                through our premium logistics partners.
              </p>
            </div>
          </motion.div>

          {/* 3. 詳細配送資訊 */}
          <div className="space-y-12 border-t border-gray-100 pt-12">
            {/* 配送時效 */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-xl font-serif mb-4 text-black">
                Delivery Time 配送時效
              </h4>
              <ul className="grid md:grid-cols-2 gap-6">
                <li className="flex flex-col p-4 border border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Domestic
                  </span>
                  <span className="font-bold text-gray-900">台灣本島配送</span>
                  <span className="text-sm text-gray-500 mt-2">
                    約 1 - 3 個工作天 (黑貓宅急便/專人配送)
                  </span>
                </li>
                <li className="flex flex-col p-4 border border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    International
                  </span>
                  <span className="font-bold text-gray-900">國際配送</span>
                  <span className="text-sm text-gray-500 mt-2">
                    亞洲約 3-5 天 / 歐美約 5-10 天 (DHL/FedEx)
                  </span>
                </li>
              </ul>
            </motion.section>

            {/* 關稅與保險 */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-[#1A1A1A] text-[#F6F1EB] p-8 md:p-10"
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-lg font-medium mb-3">全額保險運送</h4>
                  <p className="text-sm font-light opacity-80 leading-relaxed">
                    為確保高單價商品安全，所有寄出包裹皆投保全額運輸保險。若在運送過程中有任何遺失或損壞，將由保險公司與我們全權負責，保障您的資產安全。
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-3">
                    關稅說明 (Duties & Taxes)
                  </h4>
                  <p className="text-sm font-light opacity-80 leading-relaxed">
                    國際運送產生之進口關稅與當地稅費，需由收件人（買家）自行負擔。我們會依據法規如實申報，若您有特殊報關需求，請於下單前與客服聯繫確認。
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
