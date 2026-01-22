"use client";
import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Slider from "../components/HeroSlider/page";
import { motion } from "framer-motion"; // 引入動畫庫 (若未安裝請 npm install framer-motion)
import Image from "next/image";
import Link from "next/link";
import ParallaxImage from "../components/ParallaxImage";
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
      src: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_19.jpg",
      name: "PhotoGraphy",
      year: "2023",
    },
    {
      id: 2,
      src: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_7.jpg",
      name: "EtherShift-Demo",
      year: "2021",
    },
    {
      id: 3,
     src: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_12.jpg",
      name: "EtherShift-Demo",
      year: "2021",
    },
    {
      id: 4,
       src: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_16.jpg",
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
        <main className="relative z-10 bg-[#1A1A1A]">
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
                  <p className="text-xl text-[#F6F1EB] font-medium mb-4">
                   KÉSH de¹ 凱仕國際精品
                  </p>
                  <p className="mb-4 text-[#F6F1EB]">
                  成立於台中市，政府立案營運，
KÉSH de¹ 凱仕國際精品致力打造值得信賴的國際精品交易平台。
                  </p>
                </FadeInSection>

                <FadeInSection delay={0.3}>
                  <p className="text-[#F6F1EB]">
                  專營 Hermès、Chanel、Louis Vuitton、Dior、Loewe、Celine 等國際知名品牌，


                    <span className="text-[#F6F1EB] font-medium border-b border-gray-300 pb-0.5">
                     服務涵蓋全新精品與嚴選二手精品販售、顧客寄賣及指定款式代購服務，
並提供全球配送服務，讓無論身處何地的貴賓，也能輕鬆擁有。
                    </span>{" "}
                    等頂級品牌。
                  </p>
                  <p className="mt-4 text-[#F6F1EB]">
                  KÉSH 團隊具備國際精品鑑定師合格證照，
所有商品皆由專業鑑定團隊親自把關，
並搭配先進鑑定設備進行多重交叉驗證，
每件商品皆附上專屬鑑定證明，提供最高級別的正品保障。

                  </p>
                </FadeInSection>

                <FadeInSection delay={0.4}>
                  <blockquote className="relative border-l-2 border-[#F6F1EB] pl-8 py-2 my-6 italic text-[#F6F1EB] text-lg">
                    <span className="absolute -top-4 left-4 text-4xl text-[#F6F1EB] font-serif">
                      “
                    </span>
                 凡於 KÉSH 選購之商品，
皆享有國際認可單位之正品認證保障，
讓每一次交易皆安心、透明、值得信賴。

                  
                  </blockquote>
                </FadeInSection>
                <Link
                  href="/contact"
                  className="
    group relative inline-flex items-center justify-center
    h-14  w-[14rem]  border-white border-1  [clip-path:polygon(0.8rem_0,calc(100%-0.8rem)_0,100%_0.8rem,100%_calc(100%-0.8rem),calc(100%-0.8rem)_100%,0.8rem_100%,0_calc(100%-0.8rem),0_0.8rem)]
    text-sm tracking-widest
  "
                >
                  {/* 外框 */}
                  <span
                    className="
      absolute inset-0 border border-[#f6f1eb]
      [clip-path:polygon(0.8rem_0,calc(100%-0.8rem)_0,100%_0.8rem,100%_calc(100%-0.8rem),calc(100%-0.8rem)_100%,0.8rem_100%,0_calc(100%-0.8rem),0_0.8rem)]
    "
                  />

                  {/* 內底 */}
                  <span
                    className="
      relative z-10 w-full h-full
      inline-flex items-center justify-center
      bg-[#f6f1eb] text-[#1a1a1a]
      transition-colors duration-300
      group-hover:bg-[#1a1a1a] group-hover:text-[#f6f1eb]
      [clip-path:polygon(0.8rem_0,calc(100%-0.8rem)_0,100%_0.8rem,100%_calc(100%-0.8rem),calc(100%-0.8rem)_100%,0.8rem_100%,0_calc(100%-0.8rem),0_0.8rem)]
    "
                  >
                    CONTACT
                  </span>
                </Link>
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
          <div className="w-full  h-screen relative">
            <div className="txt absolute w-[400px] z-50 left-[13%] top-1/2 -translate-y-1/2">
              <img
                src="/images/about/logo_wh.svg"
                alt=""
                className="w-[500px]"
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform">
              <ParallaxImage src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_5.jpg" alt="" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT */}
            <div className="relative w-full min-h-[70vh] lg:h-screen">
              {/* TEXT */}
               <div className="absolute bg-black/50 w-full h-full z-20 left-0 top-0">
                 
              </div>
              <div className="relative lg:sticky z-50 pr-4 lg:pr-8 w-full flex justify-end top-[200px] h-auto lg:h-[200px]">
                <div className="mt-5 text-right w-2/3 lg:w-1/2">
                  <h3 className="text-white text-[32px] lg:text-[42px]">
                 Specific Style Sourcing
                  </h3>
                  <h3 className="text-white text-[20px] lg:text-[28px]">
                    指定款式代購｜
                  </h3>
                  <p className="text-white text-[14px] leading-relaxed mt-2">
                  夢幻清單不再遙不可及。KÉSH de¹ 啟動全球頂級買手網絡，無論是專櫃缺貨爆款或稀有限量聯名，我們都能跨越國界精準代尋。您只需許下心願，我們便將那份獨一無二的驚喜帶到您手中。
                  </p>
                </div>
              </div>

              {/* IMAGE */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform">
                <ParallaxImage src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_7.jpg" alt="" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative w-full min-h-[70vh] lg:h-screen">
              <div className="absolute bg-black/50 w-full h-full z-20 left-0 top-0">
                 
              </div>
              {/* TEXT */}
              <div className="relative z-50 lg:sticky   pr-4 lg:pr-8 w-full flex justify-end top-[200px] h-auto lg:h-[250px]">
                <div className="mt-5 text-right w-2/3 lg:w-1/2">
                  <h3 className="text-white text-[32px] lg:text-[42px]">
                   Professional Authentication
                  </h3>
                  <h3 className="text-white text-[20px] lg:text-[28px]">
                    專業鑑定｜
                  </h3>
                  <p className="text-white text-[14px] leading-relaxed mt-2">
                   我們拒絕任何存疑。由資深鑑定師針對皮革氣味、縫線工藝至防偽特徵進行嚴密檢測，結合科學儀器輔助驗證。唯有通過極致苛求標準的藏品，才能呈現在您眼前，確保每一份奢華都經得起考驗。
                  </p>
                </div>
              </div>

              {/* IMAGE */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform">
                <ParallaxImage src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_3.jpg" alt="" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 mt-12 lg:mt-20 gap-10 lg:gap-0">
            {/* Left: Images */}
            <div className="space-y-10">
              {/* Hero image */}
              <div className="relative w-full overflow-hidden rounded-2xl">
                {/* 高度自適應：手機較矮、桌機更高 */}
                <div className="relative h-[60vh] min-h-[420px] lg:h-screen">
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-[94%] h-full overflow-hidden will-change-transform">
                      <ParallaxImage src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_10.jpg" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two smaller images */}
              <div className="space-y-10">
                <div className="relative w-full">
                  <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
                    <div className="absolute inset-0 flex justify-end sm:pr-6 pr-4">
                      <div className="w-[94%] max-w-[420px] max-h-[420px] overflow-hidden will-change-transform">
                        <ParallaxImage
                          src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_8.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative w-full">
                  <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
                    <div className="absolute inset-0 flex justify-center">
                      <div className="w-[94%] max-w-[420px] max-h-[420px] overflow-hidden will-change-transform">
                        <ParallaxImage
                          src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_1.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="relative">
              <div
                className="
        flex flex-col  justify-end
        px-4 sm:px-6  lg:pl-10 lg:pr-8
        lg:sticky lg:top-[200px]
        h-auto lg:h-[300px]
      "
              >
                <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-light text-[#F6F1EB] leading-snug">
                  成為連結精品收藏、
                  <br className="hidden sm:block" />
                  品味生活與長期價值的橋樑。
                </h2>

                <p
                  className="
          text-[#F6F1EB] mb-5  font-light leading-loose tracking-wider
          text-[14px] sm:text-[16px]
          mt-4 sm:mt-5
          w-full max-w-prose
        "
                >
                  我們專注於 Hermès、Chanel、Dior、Louis Vuitton 等頂級品牌。
                  從來源確認、細節檢查、品況分級到配件整理，每件商品皆以嚴謹標準呈現，讓每一位貴賓能安心收藏精品之美。
                  每一處細節的堅持，都是為了讓這份美好能夠延續。
                </p>
                <Link
                  href="/category"
                  className="
    group relative inline-flex   items-center justify-center
    h-14  w-[14rem]  border-white border-1  [clip-path:polygon(0.8rem_0,calc(100%-0.8rem)_0,100%_0.8rem,100%_calc(100%-0.8rem),calc(100%-0.8rem)_100%,0.8rem_100%,0_calc(100%-0.8rem),0_0.8rem)]
    text-sm tracking-widest
  "
                >
                  {/* 外框 */}
                  <span
                    className=" 
      absolute inset-0 border border-[#f6f1eb]
      [clip-path:polygon(0.8rem_0,calc(100%-0.8rem)_0,100%_0.8rem,100%_calc(100%-0.8rem),calc(100%-0.8rem)_100%,0.8rem_100%,0_calc(100%-0.8rem),0_0.8rem)]
    "
                  />

                  {/* 內底 */}
                  <span
                    className="
      relative z-10 w-full h-full
      inline-flex items-center justify-center
      bg-[#f6f1eb] text-[#1a1a1a]
      transition-colors duration-300
      group-hover:bg-[#1a1a1a] group-hover:text-[#f6f1eb]
      [clip-path:polygon(0.8rem_0,calc(100%-0.8rem)_0,100%_0.8rem,100%_calc(100%-0.8rem),calc(100%-0.8rem)_100%,0.8rem_100%,0_calc(100%-0.8rem),0_0.8rem)]
    "
                  >
                    MORE
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section B: 願景 Vision (黑底沈浸式) */}
          {/* <section className="bg-[#111] text-white py-32  bg-[url('/images/index/DSCF7086.webp')] bg-cover bg-no-repeat bg-center px-6">
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
          </section> */}

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
        </main>
      </div>
    </ReactLenis>
  );
}
