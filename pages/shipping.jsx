import React from "react";
import Head from "next/head";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Shipping() {
  const { t } = useTranslation("common"); // 🔥 載入 common 翻譯命名空間

  const pageTitle = t("shipping.seo_title");
  const pageDesc = t("shipping.seo_desc");

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
              {t("shipping.title")}
            </h1>
            <p className="text-gray-500 font-light tracking-wider">
              {t("shipping.subtitle")}
            </p>
          </motion.div>

          {/* 2. 中英文對照區塊 (排版風格保留) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="grid md:grid-cols-2 gap-10 mb-20 items-start"
          >
            {/* 左側說明 */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {t("shipping.commitment_title")}
              </h3>
              <p className="text-gray-600 leading-loose text-justify">
                {t("shipping.commitment_desc")}
              </p>
            </div>
            {/* 右側說明 (原本的英文設計區塊) */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="text-lg font-medium mb-4 font-serif">
                {t("shipping.intl_policy_title")}
              </h3>
              <p className="text-gray-500 leading-loose text-sm font-light">
                {t("shipping.intl_policy_desc")}
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
                {t("shipping.delivery_time_title")}
              </h4>
              <ul className="grid md:grid-cols-2 gap-6">
                <li className="flex flex-col p-4 border border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    {t("shipping.domestic_label")}
                  </span>
                  <span className="font-bold text-gray-900">
                    {t("shipping.domestic_title")}
                  </span>
                  <span className="text-sm text-gray-500 mt-2">
                    {t("shipping.domestic_desc")}
                  </span>
                </li>
                <li className="flex flex-col p-4 border border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    {t("shipping.intl_label")}
                  </span>
                  <span className="font-bold text-gray-900">
                    {t("shipping.intl_title")}
                  </span>
                  <span className="text-sm text-gray-500 mt-2">
                    {t("shipping.intl_desc")}
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
                  <h4 className="text-lg font-medium mb-3">
                    {t("shipping.insurance_title")}
                  </h4>
                  <p className="text-sm font-light opacity-80 leading-relaxed">
                    {t("shipping.insurance_desc")}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-3">
                    {t("shipping.duties_title")}
                  </h4>
                  <p className="text-sm font-light opacity-80 leading-relaxed">
                    {t("shipping.duties_desc")}
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

// --- SSG: 服務端注入翻譯 ---
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
