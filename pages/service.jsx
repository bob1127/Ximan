import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// 為各個 Tab 的流程步驟定義對應的情境圖片 (使用 Unsplash 作為佔位符)
const STEP_IMAGES = {
  "buy-in": [
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop", // 拍攝
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop", // 傳訊/溝通
    "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop", // 面交/確認
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop", // 撥款/現金
  ],
  consignment: [
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop", // 預約/包包
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop", // 簽約/評估
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", // 商店展示
    "https://images.unsplash.com/photo-1580519542036-ed47f3e42218?q=80&w=800&auto=format&fit=crop", // 匯款結算
  ],
  "trade-in": [
    "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800&auto=format&fit=crop", // 挑選新包
    "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=800&auto=format&fit=crop", // 評估舊包
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop", // 計算差價
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop", // 交易完成
  ],
  sourcing: [
    "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?q=80&w=800&auto=format&fit=crop", // 尋找夢幻逸品
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop", // 報價/訂金
    "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=800&auto=format&fit=crop", // 物流配送
    "https://images.unsplash.com/photo-1580828369019-22204c4b6326?q=80&w=800&auto=format&fit=crop", // 開箱/驗收
  ],
};

export default function Services() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("buy-in");

  const servicesData = t("services.data", { returnObjects: true });
  const COMMON_REQUIREMENTS = t("services.common_requirements", {
    returnObjects: true,
  });
  const ui = t("services.ui", { returnObjects: true });
  const seo = t("services.seo", { returnObjects: true });

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const tabParam = router.query.tab;
      if (servicesData[tabParam]) {
        setActiveTab(tabParam);
      }
    }
  }, [router.isReady, router.query.tab, servicesData]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab: key } },
      undefined,
      { shallow: true },
    );
  };

  const siteUrl = "https://www.kesh-de1.com";
  const allFaqs = Object.values(servicesData).reduce(
    (acc, curr) => (curr.faq ? [...acc, ...curr.faq] : acc),
    [],
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Luxury Goods Trading Services",
    provider: {
      "@type": "Organization",
      name: "KÉSH de¹ 凱仕國際精品",
      url: siteUrl,
    },
    name: "KÉSH de¹ Services",
    description: seo.desc,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <ReactLenis root>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <div className="bg-white min-h-screen text-gray-900 pb-24">
        {/* ================= 1. Hero 圖片標題區塊 ================= */}
        <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden pt-20">
          {/* 背景圖 */}
          <Image
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000&auto=format&fit=crop"
            alt="KESH de1 Services"
            fill
            className="object-cover object-center"
            priority
          />
          {/* 黑色遮罩讓白字更明顯 */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-serif font-medium mb-4 text-white tracking-wider drop-shadow-lg"
            >
              {ui.header_title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md"
            >
              {ui.header_subtitle}
            </motion.p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-16">
          {/* ================= 2. Tab 切換按鈕 ================= */}
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
                {servicesData[key].tab_main}
                <span className="hidden md:inline ml-2 text-xs opacity-60">
                  {servicesData[key].tab_sub}
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

          {/* ================= 3. 內容顯示區 ================= */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-20"
            >
              {/* --- 服務簡介 --- */}
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-serif mb-6">
                  {servicesData[activeTab].title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-light">
                  {servicesData[activeTab].desc}
                </p>
                {servicesData[activeTab].highlight && (
                  <div className="inline-block bg-[#ef4628] text-white px-5 py-2 text-sm tracking-wide font-bold uppercase rounded-sm shadow-sm">
                    {servicesData[activeTab].highlight}
                  </div>
                )}
              </div>

              {/* --- 流程圖示意 (升級加入圖片) --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {servicesData[activeTab].steps &&
                  servicesData[activeTab].steps.map((step, index) => (
                    <div key={index} className="flex flex-col group">
                      <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-sm bg-gray-50">
                        <Image
                          src={STEP_IMAGES[activeTab][index]}
                          alt={step.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* 步驟數字標籤 (重疊在圖片上) */}
                        <div className="absolute top-3 left-3 w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold rounded-full shadow-lg z-10">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-base font-bold mb-2 tracking-wide text-black">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  ))}
              </div>

              {/* --- 詳細資訊區塊 --- */}
              {activeTab === "sourcing" ? (
                <div className="space-y-12">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-gray-50 p-8 md:p-12 rounded-sm h-full">
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-[#ef4628] rounded-full mr-3"></span>
                        {ui.sourcing_suitable_title}
                      </h4>
                      <ul className="space-y-4">
                        {servicesData.sourcing.suitableFor &&
                          servicesData.sourcing.suitableFor.map((item, i) => (
                            <li
                              key={i}
                              className="text-gray-600 text-sm flex items-start"
                            >
                              <span className="text-[#ef4628] mr-2">✓</span>{" "}
                              {item}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="relative w-full min-h-[300px] overflow-hidden rounded-sm">
                      <Image
                        src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=1000&auto=format&fit=crop"
                        alt="Sourcing Service"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {/* 其餘 sourcing 內容保持您的原樣... */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-gray-100 p-8 bg-white shadow-sm">
                      <h4 className="font-bold text-black mb-3">
                        {servicesData.sourcing.paymentPolicy.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {servicesData.sourcing.paymentPolicy.content}
                      </p>
                    </div>
                    <div className="border border-gray-100 p-8 bg-white shadow-sm">
                      <h4 className="font-bold text-black mb-3">
                        {servicesData.sourcing.refundPolicy.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {servicesData.sourcing.refundPolicy.content}
                      </p>
                    </div>
                    <div className="border border-gray-100 p-8 bg-white shadow-sm">
                      <h4 className="font-bold text-black mb-3">
                        {ui.legal_shipping_title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed mb-2">
                        <span className="font-bold text-xs bg-gray-100 px-1">
                          {ui.legal_tag}
                        </span>{" "}
                        {servicesData.sourcing.legalNote}
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        <span className="font-bold text-xs bg-gray-100 px-1">
                          {ui.shipping_tag}
                        </span>{" "}
                        {servicesData.sourcing.shipping}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-12 gap-10 items-start">
                  {/* 左側：需求清單 */}
                  <div className="md:col-span-7 grid sm:grid-cols-2 gap-8 bg-gray-50 p-8 md:p-10 rounded-sm">
                    <div>
                      <h4 className="flex items-center text-base font-bold mb-6">
                        <span className="w-2 h-2 bg-[#ef4628] rounded-full mr-3"></span>
                        {ui.online_submission_title}
                      </h4>
                      <ul className="space-y-3">
                        {COMMON_REQUIREMENTS.inStore &&
                          COMMON_REQUIREMENTS.inStore.map((item, i) => (
                            <li
                              key={i}
                              className="text-gray-600 text-sm flex items-start"
                            >
                              <span className="text-[#ef4628] mr-2">✓</span>{" "}
                              {item}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center text-base font-bold mb-6">
                        <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                        {ui.online_estimation_title}
                      </h4>
                      <ul className="space-y-3">
                        {COMMON_REQUIREMENTS.online &&
                          COMMON_REQUIREMENTS.online.map((item, i) => (
                            <li
                              key={i}
                              className="text-gray-600 text-sm flex items-start"
                            >
                              <span className="text-black mr-2">✓</span> {item}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* 右側：補充說明圖片或文字 */}
                  <div className="md:col-span-5 relative w-full h-[300px] md:h-full min-h-[350px] overflow-hidden rounded-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop"
                      alt="KESH Valuation"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-end p-6">
                      <div className="bg-white/90 backdrop-blur-sm p-4 w-full">
                        <p className="text-xs font-bold text-black mb-1">
                          {ui.pricing_method_title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {servicesData[activeTab].pricing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- FAQ 區塊 --- */}
              {servicesData[activeTab].faq && (
                <div className="mt-20 border-t border-gray-100 pt-16">
                  <h3 className="text-2xl font-serif mb-10 text-center">
                    {ui.faq_title}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
                    {servicesData[activeTab].faq.map((item, idx) => (
                      <div key={idx} className="pb-6 border-b border-gray-100">
                        <p className="font-bold text-black mb-2 tracking-wide">
                          Q. {item.q.replace(/Q\d*\.\s*/, "").trim()}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed font-light whitespace-pre-wrap">
                          A. {item.a.replace(/A\.\s*/, "").trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ================= 4. 底部 CTA 區塊 ================= */}
          <div className="mt-24 text-center border-t border-gray-200 pt-16 mb-10">
            <h2 className="text-2xl font-serif mb-4">Start Your Journey</h2>
            <p className="text-gray-500 mb-8 font-light tracking-wide">
              {activeTab === "sourcing"
                ? ui.cta_subtitle_sourcing
                : ui.cta_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://line.me/ti/p/@yourid"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#06c755] text-white px-10 py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-[#05b34c] transition-colors rounded-sm"
              >
                {activeTab === "sourcing"
                  ? ui.btn_line_sourcing
                  : ui.btn_line_estimate}
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-black text-white px-10 py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-sm"
              >
                {activeTab === "sourcing"
                  ? ui.btn_contact_sourcing
                  : ui.btn_contact_store}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
