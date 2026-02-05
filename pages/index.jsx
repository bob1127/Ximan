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
// 確保這是你剛剛修改好的那個 EmblaCarousel 元件
import ProductCarousel from '../components/EmblaCarousel08/index' 
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import Scroll from "../components/Scroll";
import HeroCarousel from '../components/HeroCarousel';
import https from "https"; // 務必確認有引入這行

// 1. 修改這裡：接收 featuredProducts 資料
export default function Home({ featuredProducts }) {
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
  const siteTitle = "KÉSH de¹ 凱仕國際精品｜高品質精品販售・寄賣・代購服務";
  const siteDescription = "KÉSH de¹ 凱仕國際精品提供高品質精品販售、寄賣與代購服務。精選 Hermès、CHANEL、Louis Vuitton 等國際精品，每件商品皆經專業鑑定。為每一段品味旅程，打造值得信任的起點。";

  // --- 結構化資料 (JSON-LD) ---
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
          "url": `${siteUrl}images/logo.png`
        },
        "description": "高品質精品販售・寄賣・代購服務，精選 Hermès、CHANEL、Louis Vuitton 等國際精品。",
        "sameAs": [
          "https://www.facebook.com/你的粉絲頁",
          "https://www.instagram.com/你的IG"
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

      <HeroCarousel/> 
      
      <ParallaxProvider>
        <section className="flex relative gap-4 my-[100px]">
          <div className="text absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 z-50">
          <div className="flex flex-col justify-center items-center">
              <h3 className="text-xl text-stone-100">Editorial Selection</h3>
             <h3 className="text-xl text-stone-100">精選風格提案</h3>
          </div>
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

      {/* 2. 修改這裡：把資料傳進去元件 */}
      <ProductCarousel slides={featuredProducts} />

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
          {/* ... 中間省略部分程式碼以節省空間，保持不變 ... */}
          <section className="relative w-screen mt-5 h-screen overflow-hidden flex justify-center items-center">
            <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
              <ParallaxImage src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_5.jpg" alt="" />
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
        </div>
      </div>
    </>
  );
}

// 3. 新增這裡：服務端抓取資料
export async function getStaticProps() {
  const WC_URL = process.env.WC_SITE_URL;
  const CK = process.env.WC_CONSUMER_KEY;
  const CS = process.env.WC_CONSUMER_SECRET;

  // 1. 安全檢查
  if (!WC_URL || !CK || !CS) {
    console.error("❌ 環境變數缺失！");
    return { props: { featuredProducts: [] } };
  }

  // 2. 設定 Agent (解決 SSL 問題)
  const agent = new https.Agent({ rejectUnauthorized: false });
  const auth = Buffer.from(`${CK}:${CS}`).toString('base64');
  const headers = {
    "User-Agent": "Mozilla/5.0 (Next.js)",
    "Authorization": `Basic ${auth}`
  };

  try {
    // 3. 抓取資料：這裡設定 featured=true (精選商品) 且只抓 10 筆
    // 技巧：如果你發現首頁還是空的，試著把 "featured=true&" 拿掉，先抓全部商品測試看看
    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/products?featured=true&status=publish&per_page=10`,
      { agent, headers }
    );

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    
    const products = await res.json();

    // 4. 資料格式化
    const formattedSlides = products.map((p) => {
      // 圖片處理
      let imageUrl = "/images/placeholder.jpg";
      if (p.images && p.images.length > 0) {
          let src = p.images[0].src;
          if (src.startsWith('http://')) {
              src = src.replace('http://', 'https://');
          }
          imageUrl = src;
      }

      const price = `NT$ ${parseInt(p.price || 0).toLocaleString()}`;
      
      // 中文標題處理 (如果短描述有寫中文就用短描述，不然就用標題)
      const cleanDesc = (p.short_description || "").replace(/<[^>]+>/g, "").trim();
      const titleZh = cleanDesc || p.name;

      return {
        id: p.id,
        slug: p.slug,
        title: p.name,       // 英文標題
        titleEn: p.name,     // 英文標題 (配合 EmblaCarousel)
        titleZh: titleZh,    // 中文標題 (配合 EmblaCarousel)
        description: price,  // 價格放在描述欄位
        price: price,        // 價格欄位
        image: imageUrl,
        content: null,
      };
    });

    return {
      props: {
        featuredProducts: formattedSlides, // 傳給頁面的 props 名稱
      },
      revalidate: 60, // 每 60 秒更新
    };

  } catch (error) {
    console.error("❌ Carousel Fetch Error:", error);
    return {
      props: { featuredProducts: [] },
      revalidate: 60,
    };
  }
}