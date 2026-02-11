import React, { useState } from "react";
import Head from "next/head";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "商品諮詢",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SEO 設定 (完全依照截圖更新) ---
  const siteUrl = "https://www.kesh-de1.com";
  const pageTitle = "聯絡我們 | Contact";
  const pageDesc =
    "全新商品尋款、二手精品販售與閒置精品寄售。售前與售後服務，歡迎透過官方線上表單或電子郵件與我們聯繫。contact@kesh-de1.com";

  // --- 結構化資料 (Schema.org) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "聯絡 KÉSH de¹",
    description: pageDesc,
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "KÉSH de¹ 凱仕國際精品",
      url: siteUrl,
      email: "contact@kesh-de1.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "contact@kesh-de1.com",
          areaServed: "TW",
          availableLanguage: ["Chinese", "English"],
        },
      ],
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    // 模擬送出 (您需自行對接後端 API)
    try {
      // 範例： const res = await fetch("/api/contact", { ... });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 模擬延遲
      setStatus({
        type: "success",
        msg: "您的訊息已發送，專員將盡快與您聯繫！",
      });
      setFormData({ name: "", email: "", service: "商品諮詢", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        msg: "發送失敗，請稍後再試或透過 LINE 聯繫我們。",
      });
    }
    setIsSubmitting(false);
  };

  // 動畫設定
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <ReactLenis root>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph (Facebook, LINE) */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta property="og:type" content="website" />
        {/* 建議：補上 OG 圖片，分享時才會漂亮 */}
        <meta property="og:image" content={`${siteUrl}/images/og-image.jpg`} />
        {/* Twitter Card (X) - 這裡就是要補的部分 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />{" "}
        {/* 👈 這裡要跟 description 一樣 */}
        <meta name="twitter:image" content={`${siteUrl}/images/og-image.jpg`} />
        {/* JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="bg-white min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-sm overflow-hidden min-h-[700px]">
          {/* 左側：品牌資訊區 (黑底奢華感) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-[#1A1A1A] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden"
          >
            {/* 裝飾背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-serif mb-6 tracking-wide">
                Contact Us
              </h1>
              <p className="text-gray-400 font-light leading-loose mb-10 text-sm md:text-base">
                全新商品尋款、二手精品販售與閒置精品寄售。
                <br />
                售前與售後服務，歡迎透過官方線上表單或電子郵件與我們聯繫。
              </p>

              <div className="space-y-8 mt-12">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:contact@kesh-de1.com"
                    className="text-xl font-serif hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-300 pb-1"
                  >
                    contact@kesh-de1.com
                  </a>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Social Media
                  </h3>
                  <div className="flex gap-6">
                    <a
                      href="https://instagram.com/hello.cieman"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm hover:opacity-70 transition-opacity"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="text-sm hover:opacity-70 transition-opacity"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-16 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-xs mb-4">想獲得最即時的回覆？</p>
              <a
                href="https://line.me/ti/p/@yourid"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-[#06c755] hover:bg-[#05b34c] text-white px-8 py-3 text-sm font-bold tracking-wider rounded-sm transition-colors w-full md:w-auto"
              >
                LINE 線上諮詢
              </a>
            </div>
          </motion.div>

          {/* 右側：線上表單 (白底簡潔感) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 md:p-16 flex flex-col justify-center"
          >
            <h2 className="text-2xl font-serif text-gray-900 mb-8">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="您的稱呼"
                    className="w-full bg-gray-50 border-b border-gray-200 focus:border-black px-4 py-3 outline-none transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border-b border-gray-200 focus:border-black px-4 py-3 outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="service"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Subject
                </label>
                <div className="relative">
                  <select
                    name="service"
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-b border-gray-200 focus:border-black px-4 py-3 outline-none appearance-none cursor-pointer transition-colors text-sm"
                  >
                    <option value="商品諮詢">商品諮詢 Product Inquiry</option>
                    <option value="精品代購">精品代購 Sourcing Request</option>
                    <option value="寄賣服務">寄賣服務 Consignment</option>
                    <option value="置換服務">置換服務 Trade-in</option>
                    <option value="售後服務">售後服務 After-sales</option>
                    <option value="其他合作">其他 Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="請簡述您的需求內容，如欲詢問特定包款，請提供品牌與型號..."
                  className="w-full bg-gray-50 border-b border-gray-200 focus:border-black px-4 py-3 outline-none resize-none transition-colors text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-all ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
              </button>

              {status.msg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 text-sm text-center ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {status.msg}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </ReactLenis>
  );
}
