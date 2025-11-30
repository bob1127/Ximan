"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SwiperEsim from "../components/EmblaCarousel01/index";
import HeroSlider from "../components/Slider/Slider";
import Layout from "./Layout";
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
    <Layout>
      {/* 背景圖片 - Parallax */}

      {/* 1. 左上角：手機 w-20 (80px), 桌機 w-[150px] */}
      <motion.div
        style={{ y: y1 }}
        className="absolute z-20 
                   w-20 h-20 top-10 left-0 
                   lg:w-[150px] lg:h-[150px] lg:top-20"
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
                   lg:w-[150px] lg:h-[150px] lg:top-20 lg:right-[20%]"
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
                    D’RENTY INC.
                  </b>
                  <p className="text-xs lg:text-[12px] leading-relaxed font-medium lg:font-normal opacity-90 lg:opacity-100">
                    株式会社ドレンティでは、店舗・内勤スタッフを募集しています。
                    詳細は採用情報をご覧ください。
                  </p>
                </div>

                {/* 下半部標題 */}
                <div>
                  <h1 className="text-6xl md:text-7xl lg:text-[4.8em] tracking-wider leading-tight font-light">
                    hello.cieman
                  </h1>
                  <p className="mt-2 lg:mt-4 text-3xl lg:text-[2.2em] font-serif">
                    喜曼精品
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
                我們打造一樓至二樓的精品展示空間，以柔和的光線、乾淨俐落的動線與高質感材質堆疊，
              </h2>
              <Scroll />
            </div>
            <div className="left justify-between  flex  flex-col  w-full lg:w-1/2 md:px-8 px-0 2xl:px-20">
              <div className="txt flex pb-4 flex-col justify-center items-center h-full">
                <p className="text-[1rem] w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  希望每位踏進店裡的貴賓，都能感受專屬於 CIÉMAN
                  的優雅與誠意。我們專注 Hermès、Chanel、Dior、Louis Vuitton
                  等頂級品牌，從來源確認、細節檢查、品況分級到配件整理，每件商品皆以嚴謹標準呈現，讓每一位貴賓能安心收藏精品之美。
                </p>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  在
                  CIÉMAN，我們相信精品不僅是商品，更是一種風格、一種質感、一種態度的延伸。
                </p>
                <b className="text-[1.2rem] font-bold mt-6">願景 Vision</b>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  打造值得信賴、具品味的精品交換中心，成為連結精品收藏、品味生活與長期價值的橋樑。
                </p>
              </div>
              <div className="more-about border-t-1 border-stone-400 mt-3">
                <p className="text-[.8rem] text-center mt-5">
                  誠實透明，尊重每一位貴賓，專業精準，安靜且高效率的服務體驗
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
                <ParallaxImage
                  src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg"
                  alt=""
                />
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
          <section className="relative overflow-hidden flex flex-col lg:flex-row gap-16 lg:gap-[10em] py-10 lg:py-0">
            {/* 左側大圖 + 覆蓋文字 */}
            <div className="relative w-full lg:w-1/2 flex justify-center">
              <div className="relative top-0 left-0 w-full h-[60vh] lg:h-auto overflow-hidden">
                <ParallaxImage
                  src="/images/index/shutterstock_3459837419.mp4"
                  alt="CIÉMAN Brand Video"
                />
              </div>

              {/* 覆蓋文字：更新為品牌核心價值 */}
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

            {/* 右側分類列表：更新為產品分類 */}
            <div className="w-full lg:w-1/2 p-10 relative flex justify-center items-center pb-20 lg:pb-0">
              <div className="relative flex flex-col justify-center items-center gap-12 lg:gap-[2em]">
                {[
                  {
                    title: "Handbags",
                    sub: "HERMÈS / CHANEL / LV / DIOR",
                  },
                  {
                    title: "Jewellery",
                    sub: "NECKLACES 項鍊 / EARRINGS 耳環 / RINGS 戒指",
                  },
                  {
                    title: "Accessories",
                    sub: "SILK 絲巾 / BELTS 皮帶 / SLG 小皮件",
                  },
                  {
                    title: "Footwear",
                    sub: "MEN'S 男士 / WOMEN'S 女士 / SNEAKERS 運動鞋",
                  },
                ].map((item, index) => (
                  <div key={index} className="text-center flex flex-col group">
                    <h1 className="text-[#1b1b1b] text-5xl lg:text-[80px] font-normal tracking-[-1px] leading-none group-hover:text-[#9c8c74] transition-colors cursor-pointer">
                      {item.title}
                    </h1>
                    <p className="uppercase text-[#555] group-hover:text-black text-xs lg:text-[14px] font-medium leading-none mt-3 lg:mt-2 tracking-widest transition-colors">
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
              <ParallaxImage
                src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_6.jpg"
                alt=""
              />
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

          <section className="flex lg:flex-row flex-col p-4 bg-[#F9F9F9] py-20">
            <div className="flex-[4] w-[90%] lg:w-1/2  mx-auto   flex flex-col lg:justify-center lg:items-center  justify-start items-start">
              <div>
                <p className="uppercase text-[#191919] mb-4 text-[14px] font-medium leading-none">
                  Hermès / Chanel / Louis Vuitton / Dior
                </p>
                <div>
                  <h1 className="uppercase text-[6vmin] font-normal tracking-[-1px] leading-none">
                    CIÉMAN 喜曼精品
                  </h1>
                  <h1 className="uppercase text-[4vmin] mt-2 font-normal tracking-[-1px] leading-none">
                    台中精品買賣
                  </h1>
                  <h1 className="uppercase text-[4vmin] mt-2 font-normal tracking-[-1px] leading-none">
                    寄賣、置換
                  </h1>
                  <h1 className="uppercase text-[6vmin] mt-8 font-normal tracking-[-1px] leading-none">
                    Contact
                  </h1>
                </div>
                <p className="uppercase text-[#191919] mt-2 text-[14px] font-medium leading-none">
                  地址｜台灣省台中市北區中清路一段 428 號
                </p>
                <p className="uppercase text-[#191919] mt-2 text-[14px] font-medium leading-none">
                  營業時間｜週一至週六 13:00–20:00
                </p>
                <p className="uppercase text-[#191919] mt-2 text-[14px] font-medium leading-none">
                  電話｜0938-535-870
                </p>
              </div>
            </div>
            <div className="flex-[2] w-[90%] mx-auto mt-[50px] lg:mt-0  lg:w-1/2 flex flex-col justify-start items-start  h-full">
              <div className="flex flex-col items-start justify-start lg:w-full w-[90%]">
                {" "}
                <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                  Store Information
                  <br />
                  <button className="border-none outline-none uppercase text-[12px] font-semibold mt-1 mb-1 px-3 py-1 text-[#ebebeb] bg-[#F83F23] rounded-full">
                    門市資訊
                  </button>
                </p>
              </div>
              <a
                href="https://www.google.com/maps/place/No.+428%E8%99%9F,+Section+1,+Zhongqing+Rd,+North+District,+Taichung+City,+404/@24.1633645,120.6748013,17z/data=!3m1!4b1!4m6!3m5!1s0x34693d7d75007ab1:0x831f28a3bf0a4416!8m2!3d24.1633645!4d120.6748013!16s%2Fg%2F11nnk_dhck?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                className="relative w-[90%] lg:w-[60%] max-w-[600px] max-h-[600px] h-[60%] overflow-hidden"
              >
                <ParallaxImage
                  src="https://lee.hpplus.jp/wp-content/uploads/2025/05/29/87141ec1861c4f3ff2b77dfec9da0df4.jpg"
                  alt=""
                />
              </a>
              <p className="uppercase text-[#191919] mt-4 text-[14px] font-medium leading-none">
                嚴選精品 / 二手精品 / 精品選購
              </p>
            </div>
          </section>
          <ParallaxProvider>
            <section className="flex relative gap-4 my-[100px]">
              <div className="text absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 z-50">
                <h3 className="text-xl text-stone-100">Professional</h3>
              </div>
              <Marquee>
                <Parallax speed={10}>
                  <img
                    src="https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/Insta_26SS_JOINT_m2028-scaled.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="https://img07.shop-pro.jp/PA01372/068/etc_base64/VE1fUENfMjAyNTA5XzI.jpg?cmsp_timestamp=20251027152717"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={3}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_7.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={10}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="https://img07.shop-pro.jp/PA01372/068/etc_base64/MjNDVUxFVF9PTF90b3BfdGFsa2F0aXZlXzAyMjQ.jpg?cmsp_timestamp=20240818182413"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
              </Marquee>
            </section>
          </ParallaxProvider>
        </div>
      </div>
    </Layout>
  );
}
