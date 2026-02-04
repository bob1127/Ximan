import { useRef } from "react";
import Head from "next/head";
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

  // Parallax 轉換
  const y1 = useTransform(scrollY, [0, 1000], [0, 100]); 
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]); 
  const y3 = useTransform(scrollY, [0, 1000], [0, 80]); 

  // --- SEO 設定 ---
  const siteUrl = "https://www.kesh-de1.com/";
  // 依據你的要求，將關鍵字與描述整合進 Title
  const siteTitle = "KÉSH de¹ 凱仕國際精品｜高品質精品販售・寄賣・代購服務";
  const siteDescription = "KÉSH de¹ 凱仕國際精品提供高品質精品販售、寄賣與代購服務。精選 Hermès、CHANEL、Louis Vuitton 等國際精品，每件商品皆經專業鑑定。為每一段品味旅程，打造值得信任的起點。";

  // --- 結構化資料 (JSON-LD) ---
  // 使用 Graph 模式同時定義 WebSite 和 Organization，這是首頁的最佳實踐
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        "name": "KÉSH de¹ 凱仕國際精品",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}images/logo.png` // 建議替換成實際 Logo 路徑
        },
        "description": "高品質精品販售・寄賣・代購服務，精選 Hermès、CHANEL、Louis Vuitton 等國際精品。",
        "sameAs": [
          "https://www.facebook.com/你的粉絲頁", // 建議填寫
          "https://www.instagram.com/你的IG"     // 建議填寫
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "url": siteUrl,
        "name": "KÉSH de¹ 凱仕國際精品",
        "description": siteDescription,
        "publisher": {
          "@id": `${siteUrl}#organization`
        },
        "inLanguage": "zh-TW"
      }
    ]
  };

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph (Facebook / LINE) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={`${siteUrl}images/index/DSCF6016.webp`} />
        <meta property="og:site_name" content="KÉSH de¹ 凱仕國際精品" />
        <meta property="og:locale" content="zh_TW" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={`${siteUrl}images/index/DSCF6016.webp`} />

        {/* 結構化資料注入 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* 以下為頁面內容，保持不變 */}
      {/* 背景圖片 - Parallax */}
      <motion.div
        style={{ y: y1 }}
        className="absolute z-20 w-20 h-20 top-20 left-0 lg:w-[150px] lg:h-[150px] lg:top-[100px]"
      >
        <Image
          src="/images/bg/bg-stuff-06.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute z-20 w-24 h-24 top-16 right-[5%] lg:w-[150px] lg:h-[150px] lg:top-[150px] lg:right-[20%]"
      >
        <Image
          src="/images/bg/bg-stuff-03.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute z-20 w-16 h-16 top-[60%] right-[5%] lg:w-[150px] lg:h-[150px] lg:top-[70%] lg:right-[10%]"
      >
        <Image
          src="/images/bg/bg-stuff-02.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute z-20 w-20 h-20 top-[75%] left-[5%] lg:w-[150px] lg:h-[150px] lg:top-[80%] lg:left-[10%]"
      >
        <Image
          src="/images/bg/bg-stuff-01.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      <div ref={scrollRef} className="relative pt-0 lg:pt-20 z-10">
        <div className="flex flex-col lg:flex-row lg:mt-0 mt-10 sm:mt-[100px] w-[95%] mx-auto relative lg:w-full h-auto overflow-hidden lg:overflow-visible">
          
          {/* 1. 左側欄位 */}
          <div className="absolute inset-0 z-30 pointer-events-none lg:static lg:block lg:w-1/3 lg:relative lg:pointer-events-auto">
            <div className="w-full h-full flex flex-col justify-between p-8 text-white mix-blend-difference lg:block lg:w-auto lg:h-auto lg:p-0 lg:text-black lg:absolute lg:z-30 lg:max-w-[700px] lg:top-[5%] lg:right-[-20%]">
              <div className="flex flex-col h-[70vh] lg:h-[600px] justify-between text-center lg:text-left">
                <div className="max-w-full lg:max-w-[400px] mx-auto lg:mx-0">
                  <b className="text-sm lg:text-[18px] tracking-widest block mb-2">
                    KESH LUXURY CO., LTD
                  </b>
                  <p className="text-xs lg:text-[12px] leading-relaxed font-medium lg:font-normal opacity-90 lg:opacity-100">
                    KÉSH de¹ 凱仕國際精品
                  </p>
                </div>

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
          <div className="relative z-10 w-full h-full lg:w-1/3 lg:h-auto">
            <div className="w-full">
              <HeroSlider />
            </div>
          </div>

          {/* 3. 右側留白欄位 */}
          <div className="hidden lg:block lg:w-1/3"></div>
        </div>

        <section className="feature sm:mt-10 xl:mt-20">
          <Gallery />
        </section>

        <section className="h-full py-5 md:py-20">
          <div className="container flex lg:flex-row flex-col max-w-[1920px] w-full xl:w-[85%] mx-auto">
            <div className="left w-full lg:w-1/2 p-10">
              <h2 className="text-[1.5rem] max-w-[500px] mx-auto text-left font-[400]">
                品牌理念｜KÉSH de¹ 命名由來
              </h2>
              <Scroll />
            </div>
            <div className="left justify-between flex flex-col w-full lg:w-1/2 md:px-8 px-0 2xl:px-20">
              <div className="txt flex pb-4 flex-col justify-center items-center h-full">
                <p className="text-[1rem] w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  「1」，代表第一，代表開始。 de¹ 中的上揚設計，象徵品味的起點與向上的追求。
                  在 KÉSH de¹ 的理念中，所有選品、服務與細節，皆以「1」為核心結構——
                  將顧客的感受與體驗，排在第1位。 對許多人而言，
                  這裡，或許正是人生第1個夢想包款的起點，品味、收藏與自我風格的開始。
                </p>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  KÉSH de¹ 不是1個系列編號，而是1種價值排序。
                </p>
                <b className="text-[1.2rem] font-bold mt-6">願景 Vision</b>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  打造值得信賴、具品味的精品交換中心，成為連結精品收藏、品味生活與長期價值的橋樑。
                </p>
              </div>
              <div className="more-about border-t-1 border-stone-400 mt-3">
                <p className="text-[.8rem] text-center mt-5">
                  在這裡，每1個選擇，始於感受；每1次收藏，源於信任。
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="app">
          <section className="overflow-hidden">
            <FullSlider />
          </section>
          <section className="relative w-full h-auto sm:h-[90vh] py-10 lg:py-20 overflow-hidden flex flex-col lg:flex-row gap-16 lg:gap-[10em]">
            <div className="w-full lg:flex-1 lg:h-auto relative">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform">
                <ParallaxImage src="/portraits/portrait4.jpg" alt="" />
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative flex items-center justify-center">
              <div className="relative flex flex-col justify-center items-center gap-4 lg:gap-[2em]">
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-3xl xl:text-6xl mb-4 font-normal tracking-[-1px] leading-none">
                 Brand Positioning


                  </h1>
                  <p className="uppercase text-[#191919] text-xs lg:text-[14px] font-medium leading-none mt-2 lg:mt-0">
                    專業鑑定｜正品保證｜顧客寄賣｜指定款式代購｜全球配送

                  </p>
                </div>
              </div>
            </div>
            <div className="relative w-full lg:w-1/2 flex justify-center">
              <div className="relative top-0 left-0 w-full h-[60vh] lg:h-auto overflow-hidden">
                <ParallaxImage src="/images/index/DSCF7013.webp" alt="" />
              </div>
              <div className="!w-[50%] max-w-[500px] lg:w-1/4 absolute top-1/2 right-6 -translate-y-1/2 z-[2] text-center lg:text-left">
                <p className="uppercase text-sm lg:text-[14px] font-medium leading-relaxed lg:leading-none text-white drop-shadow-md">
                Hermès、Chanel、Louis Vuitton、Dior、Loewe、Celine
                </p>
              </div>
            </div>
          </section>

          <section className="relative flex flex-col lg:flex-row gap-10 lg:gap-[10em] py-10 lg:py-0 overflow-hidden h-auto lg:h-[600px]">
            <div className="relative w-full lg:w-1/2 flex justify-center lg:h-full">
              <div className="relative w-full h-[60vh] lg:h-full overflow-hidden">
                <ParallaxImage
                  src="/images/index/shutterstock_3459837419.mp4"
                  alt="KÉSH de¹ Brand Video"
                />
              </div>
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
            <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
              <ParallaxImage src="/images/index/DSCF6016.webp" alt="" />
            </div>

            <div className="relative text-center z-10">
              <p className="uppercase text-[#dcdcdc] text-[14px] font-medium leading-none">
                Now
              </p>
              <h1 className="uppercase text-white text-[3rem] xl:text-[5rem] font-normal tracking-[-1px] leading-none">
                CONTACT US
              </h1>
              <p className="w-[75%] mx-auto mt-8 uppercase text-[#ececec] text-[14px] font-medium leading-none">
                比新品更迷人，是稀有與故事
              </p>
              <button className="border mt-3 border-stone-300 borderoutline-none uppercase text-[12px] font-semibold mb-1 px-3 py-1 text-[#f0f0f0] bg-[#f83f23] rounded-full">
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
                    alt="Premium Handbag"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_3.jpg"
                    className="w-[480px] h-[700px] object-cover"
                    alt="Premium Handbag"
                  />
                </Parallax>
                <Parallax speed={3}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_2.jpg"
                    className="w-[480px] h-[700px] object-cover"
                    alt="Premium Handbag"
                  />
                </Parallax>
                <Parallax speed={10}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_27.jpg"
                    className="w-[480px] h-[700px] object-cover"
                    alt="Premium Handbag"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_4.jpg"
                    className="w-[480px] h-[700px] object-cover"
                    alt="Premium Handbag"
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