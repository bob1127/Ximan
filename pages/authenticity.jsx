import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";
// 🔥 1. 引入多語系套件
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// 動畫設定
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Authenticity() {
  // 🔥 2. 啟用翻譯 Hook
  const { t } = useTranslation("common");

  // --- SEO 從語系檔抓取 ---
  const pageTitle = t("authenticity.seo_title");
  const pageDesc = t("authenticity.seo_desc");

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
              {t("authenticity.page_title")}
            </h1>
            <p className="text-gray-500 font-light tracking-wider">
              {t("authenticity.page_subtitle")}
            </p>
          </motion.div>

          {/* 2. 核心承諾 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gray-50 p-8 md:p-12 mb-16 border border-gray-100"
          >
            <h3 className="text-xl font-serif mb-6 text-center">
              {t("authenticity.commitment_title")}
            </h3>
            <p className="text-gray-600 leading-loose text-justify md:text-center mb-8">
              {t("authenticity.commitment_desc1")}
              <span className="font-bold text-black mx-1">
                {t("authenticity.commitment_highlight")}
              </span>
              {t("authenticity.commitment_desc2")}
            </p>
            <div className="flex justify-center gap-4">
              <span className="px-4 py-2 bg-black text-white text-xs tracking-widest uppercase">
                {t("authenticity.badge_tech")}
              </span>
              <span className="px-4 py-2 border border-black text-black text-xs tracking-widest uppercase">
                {t("authenticity.badge_human")}
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
                {t("authenticity.process_title")}
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-black mb-3">
                    {t("authenticity.process_1_title")}
                  </h4>
                  <p>{t("authenticity.process_1_desc")}</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-3">
                    {t("authenticity.process_2_title")}
                  </h4>
                  <p>{t("authenticity.process_2_desc")}</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-3">
                    {t("authenticity.process_3_title")}
                  </h4>
                  <p>{t("authenticity.process_3_desc")}</p>
                </div>
              </div>
            </motion.section>

            {/* 區塊 B: 保養服務 */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <h2 className="text-2xl font-serif mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-black mr-4"></span>
                {t("authenticity.care_title")}
              </h2>
              <div className="bg-[#1A1A1A] text-[#F6F1EB] p-8 md:p-10 rounded-sm">
                <h4 className="text-lg font-medium mb-4">
                  {t("authenticity.care_subtitle")}
                </h4>
                <p className="leading-relaxed font-light opacity-90 mb-6">
                  {t("authenticity.care_desc1")}
                  <span className="border-b border-white/30 pb-1 mx-1">
                    {t("authenticity.care_highlight")}
                  </span>
                  {t("authenticity.care_desc2")}
                </p>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                  <li>{t("authenticity.care_list_1")}</li>
                  <li>{t("authenticity.care_list_2")}</li>
                  <li>{t("authenticity.care_list_3")}</li>
                </ul>
              </div>
            </motion.section>
          </div>

          {/* 底部聯繫 */}
          <div className="mt-24 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-4">
              {t("authenticity.contact_desc")}
            </p>
            <Link
              href="/contact"
              className="text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
            >
              {t("authenticity.contact_btn")}
            </Link>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}

// 🔥 3. 最關鍵的一步！加入 getStaticProps 讓這個頁面讀取到 common.json
// 這行加上去之後，這頁的 Navbar 就不會再顯示 KEY 值了！
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
