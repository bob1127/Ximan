import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Services() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("buy-in");

  // 🔥 透過 returnObjects 直接將 JSON 轉換為 JavaScript 物件與陣列
  const servicesData = t("services.data", { returnObjects: true });
  const COMMON_REQUIREMENTS = t("services.common_requirements", {
    returnObjects: true,
  });
  const ui = t("services.ui", { returnObjects: true });
  const seo = t("services.seo", { returnObjects: true });

  // 監聽 URL 參數變化，自動切換 Tab
  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const tabParam = router.query.tab;
      if (servicesData[tabParam]) {
        setActiveTab(tabParam);
      }
    }
  }, [router.isReady, router.query.tab, servicesData]);

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

  // 動態組合所有 FAQ 以供 SEO Schema 使用
  const allFaqs = Object.values(servicesData).reduce((acc, curr) => {
    return curr.faq ? [...acc, ...curr.faq] : acc;
  }, []);

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
    name: "KÉSH de¹ Services",
    description: seo.desc,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "KÉSH de¹ Services",
      itemListElement: Object.keys(servicesData).map((key) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: servicesData[key].title,
          description: servicesData[key].desc,
          url: `${siteUrl}/services?tab=${key}`,
        },
      })),
    },
  };

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

  return (
    <ReactLenis root>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
        <meta name="keywords" content={seo.keywords} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.desc} />
        <meta property="og:url" content={`${siteUrl}/services`} />
        <meta property="og:site_name" content="KÉSH de¹ 凱仕國際精品" />
        <meta property="og:image" content={`${siteUrl}/images/og-image.jpg`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <div className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* 標題區 */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
              {ui.header_title}
            </h1>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              {ui.header_subtitle}
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

                {activeTab === "sourcing" && servicesData.sourcing.intro && (
                  <div className="text-left md:text-center text-sm text-gray-500 space-y-2 mb-8">
                    {servicesData.sourcing.intro.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. 流程圖示意 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-6 left-0 w-full h-[1px] bg-gray-100 -z-10" />
                {servicesData[activeTab].steps &&
                  servicesData[activeTab].steps.map((step, index) => (
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
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gray-50 p-8 md:p-12 rounded-sm">
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                        {ui.sourcing_suitable_title}
                      </h4>
                      <ul className="space-y-3">
                        {servicesData.sourcing.suitableFor &&
                          servicesData.sourcing.suitableFor.map((item, i) => (
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
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        {ui.sourcing_form_title}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="font-bold mb-2">
                          {ui.sourcing_form_subtitle}
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-4">
                          {servicesData.sourcing.formInfo &&
                            servicesData.sourcing.formInfo.map((info, i) => (
                              <li key={i}>{info}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-gray-100 p-6">
                      <h4 className="font-bold text-black mb-3">
                        {servicesData.sourcing.paymentPolicy.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {servicesData.sourcing.paymentPolicy.content}
                      </p>
                    </div>
                    <div className="border border-gray-100 p-6">
                      <h4 className="font-bold text-black mb-3">
                        {servicesData.sourcing.refundPolicy.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {servicesData.sourcing.refundPolicy.content}
                      </p>
                    </div>
                    <div className="border border-gray-100 p-6">
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

                  {servicesData.sourcing.faq && (
                    <div className="mt-16">
                      <h3 className="text-xl font-serif mb-8 text-center">
                        {ui.faq_title}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        {servicesData.sourcing.faq.map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-100 p-6 hover:shadow-sm transition-shadow"
                          >
                            <p className="font-medium text-black mb-3">
                              Q. {item.q.replace(/Q\d*\.\s*/, "").trim()}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                              A. {item.a.replace(/A\.\s*/, "").trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-900 text-white p-6 md:p-8 rounded-sm text-center mt-12">
                    <h4 className="text-lg font-serif mb-4">
                      {ui.our_promise_title}
                    </h4>
                    <p className="text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto opacity-90">
                      {ui.our_promise_desc}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gray-50 p-8 md:p-12 rounded-sm">
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
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
                              <span className="text-gray-400 mr-2">✓</span>{" "}
                              {item}
                            </li>
                          ))}
                      </ul>
                      <p className="mt-6 text-xs text-gray-400 border-t border-gray-200 pt-4">
                        {COMMON_REQUIREMENTS.privacyNote}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center text-lg font-medium mb-6">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        {ui.online_estimation_title}
                      </h4>
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 font-bold mb-2">
                          {ui.required_docs_title}
                        </p>
                        <ul className="space-y-2">
                          {COMMON_REQUIREMENTS.online &&
                            COMMON_REQUIREMENTS.online.map((item, i) => (
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
                          {ui.pricing_method_title}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {servicesData[activeTab].pricing}
                        </p>
                      </div>
                    </div>
                  </div>

                  {servicesData[activeTab].faq && (
                    <div className="mt-16">
                      <h3 className="text-xl font-serif mb-8 text-center">
                        {ui.faq_title}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        {servicesData[activeTab].faq.map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-100 p-6 hover:shadow-sm transition-shadow"
                          >
                            <p className="font-medium text-black mb-3">
                              Q. {item.q.replace(/Q\d*\.\s*/, "").trim()}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                              A. {item.a.replace(/A\.\s*/, "").trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-16 pt-12 border-t border-gray-200 text-center max-w-2xl mx-auto space-y-6">
                    <p className="text-[#ef4628] font-bold tracking-wide">
                      {ui.conclusion_title}
                    </p>
                    <p
                      className="text-gray-600 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: ui.conclusion_desc1 }}
                    />
                    <p
                      className="text-gray-600 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: ui.conclusion_desc2 }}
                    />
                    <div className="pt-4">
                      <Link
                        href="/contact"
                        className="inline-block border-b-2 border-black pb-1 text-sm font-bold tracking-widest hover:text-[#ef4628] hover:border-[#ef4628] transition-colors"
                      >
                        {ui.contact_team_btn}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 底部 CTA 區塊 */}
          <div className="mt-20 text-center border-t border-gray-100 pt-16">
            <p className="text-gray-500 mb-6">
              {activeTab === "sourcing"
                ? ui.cta_subtitle_sourcing
                : ui.cta_subtitle}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="https://line.me/ti/p/@yourid"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#06c755] text-white px-8 py-3 text-sm tracking-widest hover:bg-[#05b34c] transition-colors"
              >
                {activeTab === "sourcing"
                  ? ui.btn_line_sourcing
                  : ui.btn_line_estimate}
              </a>
              <Link
                href="/contact"
                className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors"
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

// --- SSG: 服務端注入翻譯 ---
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
