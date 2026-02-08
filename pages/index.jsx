// pages/index.js
import React, { useRef, useState, useCallback, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-marquee-slider";
import https from "https"; 
import useEmblaCarousel from "embla-carousel-react"; 

// 其他原本首頁的元件
import HeroSlider from "../components/Slider/Slider";
import ParallaxImage from "../components/ParallaxImage";
import Gallery from "../components/ImageTextSlider";
import FullSlider from "../components/HeroSlideContact/page";
import Scroll from "../components/Scroll";
import HeroCarousel from '../components/HeroCarousel';
import { ParallaxProvider, Parallax } from "react-scroll-parallax";

export default function Home({ featuredProducts }) {
  // --- 1. 頁面滾動特效 ---
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const y1 = useTransform(scrollY, [0, 1000], [0, 100]); 
  
  // --- 2. 輪播設定 (調整為更流暢的滑動) ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps"
  });
  
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((api) => {
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // --- 3. 字數限制小工具 (限制 15 字) ---
  const truncateTitle = (str, limit = 15) => {
    if (!str) return "";
    return str.length > limit ? str.substring(0, limit) + "..." : str;
  };

  // --- SEO 設定 ---
  const siteUrl = "https://www.kesh-de1.com/";
  const siteTitle = "KÉSH de¹ 凱仕國際精品";
  const siteDescription = "KÉSH de¹ 凱仕國際精品提供高品質精品販售、寄賣與代購服務。";
  const jsonLd = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "url": siteUrl, "name": "KÉSH de¹" }] };

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <HeroCarousel/> 
      
      <ParallaxProvider>
        <section className="flex relative gap-4 my-[100px]">
          <div className="text absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 z-50">
             <div className="flex flex-col justify-center items-center">
                <h3 className="text-xl text-stone-100">Editorial Selection</h3>
                <h3 className="text-xl text-stone-100">精選風格提案</h3>
             </div>
          </div>
          <Marquee velocity={25}>
            {[
              "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_19.jpg",
              "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_3.jpg",
              "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_2.jpg",
              "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_27.jpg",
              "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_4.jpg"
            ].map((src, index) => (
              <div key={index} className="px-2">
                <Parallax speed={index % 2 === 0 ? 10 : 5}>
                   <img src={src} className="w-[480px] h-[700px] object-cover" alt="Handbag" />
                </Parallax>
              </div>
            ))}
          </Marquee>
        </section>
      </ParallaxProvider>

      {/* =======================================================
          🔥 極簡雜誌風格輪播 (Updated Style)
      ======================================================= */}
      <section className="py-20 relative container mx-auto px-6 md:px-12">
        
        {/* 標題與控制按鈕區 */}
        <div className="flex justify-between items-end mb-10 px-2">
          <h2 className="text-2xl md:text-3xl font-normal tracking-[0.2em] uppercase text-gray-900">
            Featured Collections
          </h2>
          {/* 極簡箭頭 */}
          <div className="hidden md:flex gap-6">
            <button onClick={scrollPrev} disabled={prevBtnDisabled} className="text-gray-400 hover:text-black transition-colors disabled:opacity-20">
              <span className="text-2xl">←</span>
            </button>
            <button onClick={scrollNext} disabled={nextBtnDisabled} className="text-gray-400 hover:text-black transition-colors disabled:opacity-20">
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>

        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-6 md:-ml-8">
            {featuredProducts && featuredProducts.map((slide, index) => (
              <div 
                className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-6 md:pl-8 relative" 
                key={slide.id || index}
              >
                {/* 🔥 風格修改重點：
                   1. 移除 border, shadow, rounded
                   2. 圖片改為 4:5 比例 (aspect-[4/5])
                   3. 文字靠左 (text-left)
                */}
                <Link href={`/product/${slide.slug}`} className="group block w-full">
                  
                  {/* 圖片區域：極簡、無框 */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 mb-5">
                    <img
                      src={slide.image}
                      className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                      alt={slide.titleEn}
                    />
                  </div>

                  {/* 文字區域：極簡排版 */}
                  <div className="flex flex-col items-start space-y-1">
                    {/* 上方小字：價格或系列名 (灰色、全大寫、寬間距) */}
                    <span className="text-[11px] md:text-[12px] text-gray-500 uppercase tracking-[0.15em] font-medium">
                      {slide.price}
                    </span>

                    {/* 主標題：限制 15 字 (黑色、襯線體或乾淨無襯線) */}
                    <h3 className="text-[15px] md:text-[16px] text-gray-900 font-normal tracking-wide leading-relaxed group-hover:text-gray-600 transition-colors">
                      {truncateTitle(slide.titleZh || slide.titleEn, 15)}
                    </h3>
                  </div>

                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ======================================================= */}

      <div ref={scrollRef} className="relative pt-0 lg:pt-20 z-10">
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
                </p>
                <b className="text-[1.2rem] font-bold mt-6">願景 Vision</b>
                <p className="text-[1rem] mt-7 w-[80%] md:w-2/3 leading-relaxed -tracking-tighter">
                  打造值得信賴、具品味的精品交換中心。
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <div className="app">
          <section className="overflow-hidden">
            <FullSlider />
          </section>
           <section className="relative w-screen mt-5 h-screen overflow-hidden flex justify-center items-center">
            <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
              <ParallaxImage src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_5.jpg" alt="" />
            </div>
            <div className="relative text-center z-10">
              <h1 className="uppercase text-white text-[3rem] xl:text-[5rem] font-normal tracking-[-1px] leading-none">
                CONTACT US
              </h1>
              <button className="border mt-3 border-stone-300 px-3 py-1 text-[#f0f0f0] bg-[#f83f23] rounded-full">
                Link to Contact
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// --- SSG: 服務端抓取資料 ---
export async function getStaticProps() {
  const WC_URL = process.env.WC_SITE_URL;
  const CK = process.env.WC_CONSUMER_KEY;
  const CS = process.env.WC_CONSUMER_SECRET;

  if (!WC_URL || !CK || !CS) {
    console.error("❌ 環境變數缺失！");
    return { props: { featuredProducts: [] } };
  }

  const agent = new https.Agent({ rejectUnauthorized: false });
  const auth = Buffer.from(`${CK}:${CS}`).toString('base64');
  const headers = {
    "User-Agent": "Mozilla/5.0 (Next.js)",
    "Authorization": `Basic ${auth}`
  };

  try {
    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/products?status=publish&per_page=10`, 
      { agent, headers }
    );

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const products = await res.json();
    console.log(`✅ 成功抓取到 ${products.length} 筆商品`);

    // 資料格式化
    const formattedSlides = products.map((p) => {
      let imageUrl = "/images/placeholder.jpg";
      if (p.images && p.images.length > 0) {
          let src = p.images[0].src;
          if (src.startsWith('http://')) {
              src = src.replace('http://', 'https://');
          }
          imageUrl = src;
      }

      const price = `NT$ ${parseInt(p.price || 0).toLocaleString()}`;
      const cleanDesc = (p.short_description || "").replace(/<[^>]+>/g, "").trim();
      const titleZh = cleanDesc || p.name;

      return {
        id: p.id,
        slug: p.slug,
        titleEn: p.name,     
        titleZh: titleZh,    
        price: price,        
        image: imageUrl,     
      };
    });

    return {
      props: {
        featuredProducts: formattedSlides, 
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Carousel Fetch Error:", error);
    return {
      props: { featuredProducts: [] },
      revalidate: 60,
    };
  }
}