"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SwiperEsim from "../components/EmblaCarousel01/index";
import HeroSlider from "../components/Slider/Slider";

import ParallaxImage from "../components/ParallaxImage";
import Marquee from "react-marquee-slider";
import Image from "next/image";
import Gallery from "../components/ImageTextSlider";
import FullSlider from "../components/HeroSlideContact/page";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import Scroll from "../components/Scroll";
export default function Home() {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Parallax 轉換，分別給不同圖片不同速度
  const y1 = useTransform(scrollY, [0, 1000], [0, 100]); // 慢速
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]); // 中速
  const y3 = useTransform(scrollY, [0, 1000], [0, 80]); // 更慢

  return (
    <>
      {/* 背景圖片 - Parallax */}

      {/* 1. 左上角：手機 w-20 (80px), 桌機 w-[150px] */}
      <motion.div
        style={{ y: y1 }}
        className="absolute z-20 
                   w-20 h-20 top-20 left-0 
                   lg:w-[150px] lg:h-[150px] lg:top-[100px]"
      >
        <Image
          src="/images/bg/bg-stuff-06.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* 2. 右上角：手機 w-24 (96px) */}
      <motion.div
        style={{ y: y2 }}
        className="absolute z-20 
                   w-24 h-24 top-16 right-[5%] 
                   lg:w-[150px] lg:h-[150px] lg:top-[150px] lg:right-[20%]"
      >
        <Image
          src="/images/bg/bg-stuff-03.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* 3. 右下角：手機版縮小至 w-16 (64px) 避免擋到文字 */}
      <motion.div
        style={{ y: y2 }}
        className="absolute z-20 
                   w-16 h-16 top-[60%] right-[5%]
                   lg:w-[150px] lg:h-[150px] lg:top-[70%] lg:right-[10%]"
      >
        <Image
          src="/images/bg/bg-stuff-02.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* 4. 左下角：手機版 w-20 */}
      <motion.div
        style={{ y: y3 }}
        className="absolute z-20 
                   w-20 h-20 top-[75%] left-[5%]
                   lg:w-[150px] lg:h-[150px] lg:top-[80%] lg:left-[10%]"
      >
        <Image
          src="/images/bg/bg-stuff-01.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>
      {/* Parallax 參考容器 */}
      <div ref={scrollRef} className="relative pt-0 lg:pt-20 z-10">
        <div className="flex flex-col lg:flex-row lg:mt-0 mt-[100px] w-[95%]  mx-auto relative lg:w-full   h-auto overflow-hidden lg:overflow-visible">
          {/* 1. 左側欄位 (大螢幕是 1/3, 手機是滿版覆蓋層) */}
          <div className="absolute inset-0 z-30 pointer-events-none lg:static lg:block lg:w-1/3 lg:relative lg:pointer-events-auto">
            {/* 文字定位容器 */}
            {/* 重點修正：
        1. Mobile (預設): w-full h-full flex ... (讓文字垂直分佈在畫面中)
        2. Desktop (lg): 嚴格還原你的原始設定 (absolute top-[5%] right-[-20%])
    */}
            <div
              className="
      w-full h-full flex flex-col justify-between p-8 text-white mix-blend-difference
      lg:block lg:w-auto lg:h-auto lg:p-0 lg:text-black
      lg:absolute lg:z-30 lg:max-w-[700px] lg:top-[5%] lg:right-[-20%]
    "
            >
              {/* 內容區塊 */}
              <div className="flex flex-col h-[70vh] lg:h-[600px] justify-between text-center lg:text-left">
                {/* 上半部文字 */}
                <div className="max-w-full lg:max-w-[400px] mx-auto lg:mx-0">
                  <b className="text-sm lg:text-[18px] tracking-widest block mb-2">
                    KESH LUXURY CO., LTD

                  </b>
                  <p className="text-xs lg:text-[12px] leading-relaxed font-medium lg:font-normal opacity-90 lg:opacity-100">
KÉSH de¹ 凱仕國際精品
                  </p>
                </div>

                {/* 下半部標題 */}
                <div>
                  <h1 className="text-6xl md:text-7xl lg:text-[4.8em] tracking-wider leading-tight font-light">
                    KÉSH de¹ 
                  </h1>
                  <p className="mt-2 lg:mt-4 text-3xl lg:text-[2.2em] font-serif">
                   凱仕國際精品
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 中間 Slider 欄位 */}
          <div className="relative z-10  w-full h-full lg:w-1/3 lg:h-auto">
            <div className="w-full    ">
              <HeroSlider />
            </div>
          </div>

          {/* 3. 右側留白欄位 (僅在桌機顯示) */}
          <div className="hidden lg:block lg:w-1/3"></div>
        </div>
        <section className="feature sm:mt-10 xl:mt-20">
          {" "}
          <Gallery />
        </section>
        <section className=" h-full  py-5 md:py-20">
          <div className="container flex lg:flex-row flex-col  max-w-[1920px] w-full xl:w-[85%] mx-auto">
            <div className="left   w-full lg:w-1/2 p-10">
              <h2 className="text-[1.5rem] max-w-[500px] mx-auto text-left font-[400]">
      品牌理念｜KÉSH de¹ 命名由來

              </h2>
              <Scroll />
            </div>
            <div className="left justify-between  flex  flex-col  w-full lg:w-1/2 md:px-8 px-0 2xl:px-20">
              <div className="txt flex pb-4 flex-col justify-center items-center h-full">
                <p className="text-[1rem] w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                「1」，代表第一，代表開始。
de¹ 中的上揚設計，象徵品味的起點與向上的追求。
在 KÉSH de¹ 的理念中，
所有選品、服務與細節，
皆以「1」為核心結構——
將顧客的感受與體驗，排在第1位。
對許多人而言，
這裡，或許正是人生第1個夢想包款的起點，
品味、收藏與自我風格的開始。

                </p>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                 KÉSH de¹ 不是1個系列編號，
而是1種價值排序。

                </p>
                <b className="text-[1.2rem] font-bold mt-6">願景 Vision</b>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  打造值得信賴、具品味的精品交換中心，成為連結精品收藏、品味生活與長期價值的橋樑。
                </p>
              </div>
              <div className="more-about border-t-1 border-stone-400 mt-3">
                <p className="text-[.8rem] text-center mt-5">
                在這裡，
每1個選擇，始於感受；
每1次收藏，源於信任。

                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="app">
          {/* 
          <section className="relative w-screen h-screen overflow-hidden">
            <div className="relative flex-1 flex flex-col justify-center items-center p-4">
              <p className="underline mb-2 uppercase text-[#191919] text-[14px] font-medium leading-none">
                Introduction
              </p>
              <p className="w-1/2 text-center uppercase text-[#191919] text-[14px] font-medium leading-none">
                Liam Cartwright's 2023 sensation “Sundown” made waves...
              </p>
            </div>
          </section> */}
          <section className="overflow-hidden">
            {" "}
            <FullSlider />
          </section>
          <section className="relative w-full h-auto sm:h-[90vh] py-10 lg:py-20 overflow-hidden flex flex-col lg:flex-row gap-16 lg:gap-[10em]">
            {/* 左側圖片區 */}
            <div className="w-full lg:flex-1  lg:h-auto relative">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform">
                <ParallaxImage src="/portraits/portrait4.jpg" alt="" />
              </div>
            </div>

            {/* 中間文字區 */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center">
              <div className="relative flex flex-col justify-center items-center gap-4 lg:gap-[2em]">
                <div className="text-center flex flex-col">
                  {/* 字體從 5xl 變到 80px */}
                  <h1 className="text-[#1b1b1b] text-5xl lg:text-[80px] font-normal tracking-[-1px] leading-none">
                    Sunrise
                  </h1>
                  <p className="uppercase text-[#191919] text-xs lg:text-[14px] font-medium leading-none mt-2 lg:mt-0">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
              </div>
            </div>

            {/* 右側圖片區 */}
            <div className="relative w-full lg:w-1/2 flex justify-center">
              <div className="relative top-0 left-0 w-full h-[60vh] lg:h-auto overflow-hidden">
                {/* 增加一個遮罩讓白色文字在手機上也清楚，或是手機版改文字顏色 */}
                <ParallaxImage src="/images/index/DSCF7013.webp" alt="" />
              </div>

              {/* RWD 處理重點：
       1. 手機版 (預設)：relative, bg-black/50 (增加底色), 放在圖片下方或疊加
       2. 桌機版 (lg)：absolute, 定位在原本位置
    */}
              <div className="!w-[50%] max-w-[500px]  lg:w-1/4 absolute top-1/2  right-6 -translate-y-1/2 z-[2] text-center lg:text-left">
                <p className="uppercase text-sm lg:text-[14px] font-medium leading-relaxed lg:leading-none text-white drop-shadow-md">
                  Liam Cartwright's 2023 breakout track “Sundown” climbed the
                  global charts, achieved multi-platinum status, and amassed
                  over 1 billion streams in its first year.
                </p>
              </div>
            </div>
          </section>

    {/* 第二區塊 */}
<section className="relative flex flex-col lg:flex-row gap-10 lg:gap-[10em] py-10 lg:py-0 overflow-hidden h-auto lg:h-[600px]">
  
  {/* 左側大圖 + 覆蓋文字 */}
  {/* 修正：加入 lg:h-full 確保左側區塊在電腦版佔滿高度 */}
  <div className="relative w-full lg:w-1/2 flex justify-center lg:h-full">
    
    {/* 影片容器 */}
    {/* 修正：
        1. 手機版維持 h-[60vh] (或你想要的任何高度)
        2. 電腦版改為 lg:h-full (填滿父層的 600px)，確保影片一定會顯示
    */}
    <div className="relative w-full h-[60vh] lg:h-full overflow-hidden">
      <ParallaxImage
        src="/images/index/shutterstock_3459837419.mp4"
        alt="CIÉMAN Brand Video"
        // 確保 ParallaxImage 內部有 className="w-full h-full object-cover" 之類的設定
      />
    </div>

    {/* 覆蓋文字 */}
    <div className="w-[80%] sm:w-[50%] lg:w-1/3 absolute top-1/2 right-0 sm:right-6 -translate-y-1/2 z-[2] text-center lg:text-left pointer-events-none">
      <p className="uppercase text-sm lg:text-[14px] font-medium leading-relaxed lg:leading-loose text-white drop-shadow-md tracking-wider">
        <br className="hidden lg:block" />
        We believe luxury is not just a product, but an extension of
        <span className="block mt-4 text-xs opacity-80 font-normal normal-case">
          We believe luxury is not just a product, but an extension of
          style, quality, and attitude.
        </span>
      </p>
    </div>
  </div>

  {/* 右側分類列表 */}
  {/* 修正：加入 lg:h-full 與 items-center 確保垂直置中 */}
  <div className="w-full lg:w-1/2 py-10 lg:py-0 relative flex justify-center items-center lg:h-full">
    <div className="relative flex flex-col justify-center items-center gap-8 lg:gap-[2em]">
      {[
        {
          title: "Authenticity Guaranteed",
          sub: "每件商品皆經專業鑑定與來源確認，附實拍影片與品況說明",
        },
        {
          title: "Condition Verified",
          sub: "品況分級 S / A / AB / B，完整告知",
        },
        {
          title: "Worldwide Shipping",
          sub: "24–48 小時出貨，支援國際配送，全程可追蹤",
        },
      ].map((item, index) => (
        <div key={index} className="text-center flex flex-col group px-4">
          <h1 className="text-[#1b1b1b] text-2xl lg:text-[40px] font-normal tracking-[-1px] leading-none group-hover:text-[#9c8c74] transition-colors cursor-pointer">
            {item.title}
          </h1>
          <p className="uppercase text-[#555] group-hover:text-black text-xs lg:text-[14px] font-medium leading-normal mt-2 lg:mt-2 tracking-widest transition-colors">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
          <section className="relative w-screen mt-5 h-screen overflow-hidden flex justify-center items-center">
            {/* 修改處：這裡補上 h-full，讓它跟 section 一樣高 */}
            <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
              <ParallaxImage src="/images/index/DSCF6016.webp" alt="" />
            </div>

            <div className="relative text-center z-10">
              {" "}
              {/* 建議加個 z-10 確保文字浮在圖片上 */}
              <p className="uppercase text-[#dcdcdc] text-[14px] font-medium leading-none">
                Now
              </p>
              <h1 className="uppercase text-white text-[3rem] xl:text-[5rem] font-normal tracking-[-1px] leading-none">
                CONTACT US
              </h1>
              <p className="w-[75%] mx-auto mt-8 uppercase text-[#ececec] text-[14px] font-medium leading-none">
                比新品更迷人，是稀有與故事
              </p>
              <button className="border mt-3 border-stone-300 borderoutline-none uppercase text-[12px] font-semibold  mb-1 px-3 py-1 text-[#f0f0f0] bg-[#f83f23] rounded-full">
                Link to Contact
              </button>
            </div>
          </section>

          <ParallaxProvider>
            <section className="flex relative gap-4 my-[100px]">
              <div className="text absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 z-50">
                <h3 className="text-xl text-stone-100">Professionald</h3>
              </div>
              <Marquee>
                <Parallax speed={10}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_19.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_3.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={3}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_2.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={10}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_27.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_4.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
              </Marquee>
            </section>
          </ParallaxProvider>
        </div>
      </div>
    </>
  );
}
