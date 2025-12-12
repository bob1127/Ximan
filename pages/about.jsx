"use client";
import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Slider from "../components/HeroSlider/page";
import { motion } from "framer-motion"; // 引入動畫庫 (若未安裝請 npm install framer-motion)
import Image from "next/image";
// --- 子元件：文字區塊動畫設定 ---
const FadeInSection = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function About() {
  // 1. Slider 資料
  const sliderData = [
    {
      id: 1,
      src: "/images/index/DSCF7041.jpg",
      name: "PhotoGraphy",
      year: "2023",
    },
    {
      id: 2,
      src: "/images/index/DSCF7126.jpg",
      name: "EtherShift-Demo",
      year: "2021",
    },
    {
      id: 3,
      src: "/images/index/DSCF5948-2.jpg",
      name: "EtherShift-Demo",
      year: "2021",
    },
    {
      id: 4,
      src: "/images/index/DSCF6011.jpg",
      name: "EtherShift-Demo",
      year: "2021",
    },
    // ... 其他資料保持不變
  ];

  return (
    <ReactLenis root>
      <div className="bg-white min-h-screen">
        {/* --- 1. Hero Slider --- */}
        <Slider slides={sliderData} />

        {/* --- 2. 關於我們 內容區塊 --- */}
        <main className="relative z-10 bg-white">
          {/* Section A: 品牌故事 (極簡留白風格) */}
          <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
              {/* 左側：標題 + 圖片 (加入 Sticky 效果) */}
              <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32">
                <FadeInSection>
                  <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
                    About CIÉMAN
                  </h2>
                  <h1 className="text-2xl md:text-3xl lg:text-3xl font-serif font-medium leading-tight text-gray-900 mb-8">
                    感受專屬於CIÉMAN的
                    <br />
                    優雅與誠意
                  </h1>

                  {/* 圖片容器：設定比例與圓角 */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-gray-100">
                    <Image
                      src="/images/index/DSCF7179.webp"
                      alt="CIÉMAN Interior"
                      fill // 使用 fill 讓圖片自動填滿容器
                      className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority // 如果這是視窗第一張圖，建議加 priority
                    />
                  </div>
                </FadeInSection>
              </div>

              {/* 右側：文字內容 (增加行距與呼吸感) */}
              <div className="lg:col-span-7 flex flex-col gap-10 lg:pt-20 text-gray-600 font-light leading-loose text-justify">
                <FadeInSection delay={0.2}>
                  <p className="text-xl text-gray-900 font-medium mb-4">
                    CIÉMAN 喜曼精品成立於台中。
                  </p>
                  <p className="mb-4">
                    我們打造一樓至二樓的精品展示空間，以柔和的光線、乾淨俐落的動線與高質感材質堆疊，
                    希望每位踏進店裡的貴賓，都能在喧囂的城市中，找到一處安靜品味生活的角落。
                  </p>
                </FadeInSection>

                <FadeInSection delay={0.3}>
                  <p>
                    我們專注於{" "}
                    <span className="text-black font-medium border-b border-gray-300 pb-0.5">
                      Hermès、Chanel、Dior、Louis Vuitton
                    </span>{" "}
                    等頂級品牌。
                  </p>
                  <p className="mt-4">
                    從來源確認、細節檢查、品況分級到配件整理，每件商品皆以嚴謹標準呈現，讓每一位貴賓能安心收藏精品之美。
                    每一處細節的堅持，都是為了讓這份美好能夠延續。
                  </p>
                </FadeInSection>

                <FadeInSection delay={0.4}>
                  <blockquote className="relative border-l-2 border-black pl-8 py-2 my-6 italic text-gray-500 text-lg">
                    <span className="absolute -top-4 left-4 text-4xl text-gray-200 font-serif">
                      “
                    </span>
                    在 CIÉMAN，我們相信精品不僅是商品，
                    <br className="hidden md:block" />
                    更是一種風格、一種質感、一種態度的延伸。
                  </blockquote>
                </FadeInSection>

                {/* 額外增加一段裝飾或結尾，平衡左右長度 (可選) */}
                <FadeInSection delay={0.5}>
                  <div className="h-[1px] w-20 bg-gray-200 mt-8 mb-4"></div>
                  <p className="text-sm text-gray-400 tracking-wider">
                    EST. TAICHUNG
                  </p>
                </FadeInSection>
              </div>
            </div>
          </section>

          {/* Section B: 願景 Vision (黑底沈浸式) */}
          <section className="bg-[#111] text-white py-32  bg-[url('/images/index/DSCF7086.webp')] bg-cover bg-no-repeat bg-center px-6">
            <div className="max-w-4xl mx-auto text-center py-20">
              <FadeInSection>
                <span className="text-gold-500 text-xs tracking-[0.3em] uppercase opacity-60 block mb-6">
                  Our Vision
                </span>
                <h3 className="text-2xl md:text-4xl font-serif leading-normal mb-8 text-[#f3f3f3]">
                  打造值得信賴、具品味的精品交換中心，
                  <br />
                  成為連結精品收藏、品味生活
                  <br />
                  與長期價值的橋樑。
                </h3>
                <div className="w-16 h-[1px] bg-white/20 mx-auto"></div>
              </FadeInSection>
            </div>
          </section>

          {/* Section C: 服務精神 & 三大保證 (雜誌風格排版) */}
          <section className="px-6 py-24 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {/* 左欄：服務精神 */}
              <div>
                <FadeInSection>
                  <h4 className="text-2xl font-serif mb-10 border-b border-gray-200 pb-4">
                    Service Spirit{" "}
                    <span className="text-sm font-sans text-gray-400 ml-2">
                      服務精神
                    </span>
                  </h4>
                  <ul className="space-y-6">
                    {[
                      {
                        en: "Honesty",
                        ch: "誠實透明",
                        desc: "資訊公開，無隱藏細節",
                      },
                      {
                        en: "Respect",
                        ch: "尊重每一位貴賓",
                        desc: "以禮相待，重視您的需求",
                      },
                      {
                        en: "Professional",
                        ch: "專業精準",
                        desc: "嚴格鑑定，精確分級",
                      },
                      {
                        en: "Efficiency",
                        ch: "安靜且高效率",
                        desc: "不打擾的溫柔，最迅速的服務",
                      },
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="group flex items-baseline justify-between hover:bg-gray-50 px-4 py-3 -mx-4 rounded transition-colors"
                      >
                        <div>
                          <span className="font-serif text-lg text-gray-900 mr-3">
                            {item.en}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.desc}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.ch}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FadeInSection>
              </div>

              {/* 右欄：三大保證 */}
              <div>
                <FadeInSection delay={0.2}>
                  <h4 className="text-2xl font-serif mb-10 border-b border-gray-200 pb-4">
                    Our Guarantee{" "}
                    <span className="text-sm font-sans text-gray-400 ml-2">
                      三大保證
                    </span>
                  </h4>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "正品保證",
                        sub: "Authenticity",
                        desc: "僅販售 100% 經來源驗證與鑑定之正品，杜絕任何仿冒疑慮。",
                      },
                      {
                        title: "透明定價",
                        sub: "Transparent",
                        desc: "拒絕模糊地帶，所有品況、配件與售價皆清楚公開。",
                      },
                      {
                        title: "快速服務",
                        sub: "Fast Service",
                        desc: "線上初估 24 小時內回覆、現場成交當日撥款，不浪費您的寶貴時間。",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-6 rounded-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-end mb-3">
                          <h5 className="text-xl font-medium text-gray-900">
                            {item.title}
                          </h5>
                          <span className="text-xs text-gray-400 tracking-wider uppercase">
                            {item.sub}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </FadeInSection>
              </div>
            </div>
          </section>

          {/* 底部 CTA */}
          <section className="py-20 text-center bg-gray-50">
            <FadeInSection>
              <p className="text-gray-500 mb-6 font-serif italic">
                Discover your next collection.
              </p>
              <a
                href="/contact"
                className="inline-block bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors uppercase"
              >
                Contact Us
              </a>
            </FadeInSection>
          </section>
        </main>
      </div>
    </ReactLenis>
  );
}
