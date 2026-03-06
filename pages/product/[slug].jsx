import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import https from "https";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// 引入 Swiper 相關模組
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { useCart } from "@/components/context/CartContext";
import {
  Star,
  ChevronDown,
  Plus,
  Minus,
  Info,
  CheckCircle2,
} from "lucide-react";

// --- FAQ 摺疊組件 UI ---
const FAQAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group focus:outline-none"
      >
        <span className="text-[13px] font-bold uppercase tracking-widest group-hover:text-[#ef4628] transition-colors">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={14} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-[12px] text-gray-500 leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductDetail({ product }) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const ui = t("product_detail.ui", { returnObjects: true });

  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null); // 控制大小圖連動的 State
  const [mounted, setMounted] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (router.isFallback || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold tracking-widest uppercase text-gray-500">
        Loading Product...
      </div>
    );
  }

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.kesh-de1.com";
  const currentUrl = `${SITE_URL}/product/${product.slug}`;

  // 🔥 確保能抓到商品第一張圖，做為社群分享的首圖
  const ogImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : `${SITE_URL}/default-og-image.jpg`;

  // ===================== JSON-LD 結構化資料 (Product + FAQ) =====================
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        image: product.images,
        description: product.shortDescPlain,
        sku: product.sku || product.id.toString(),
        brand: { "@type": "Brand", name: product.brand },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.averageRating > 0 ? product.averageRating : "5",
          reviewCount: product.ratingCount > 0 ? product.ratingCount : "1",
          bestRating: "5",
          worstRating: "1",
        },
        offers: {
          "@type": "Offer",
          url: currentUrl,
          priceCurrency: "TWD",
          price: product.rawPrice,
          itemCondition: "https://schema.org/UsedCondition",
          availability: product.specs.inStoreView
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "KÉSH de¹" },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "KÉSH de¹ 提供哪些精品品牌代購？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "我們專精於精品品牌代購與寄賣，包含 Hermès, Chanel, Louis Vuitton, Dior, Gucci, Loewe, Celine, YSL, Prada 等。",
            },
          },
          {
            "@type": "Question",
            name: "網站支援哪些付款方式？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "我們提供多種安全支付方式：VISA, MasterCard, JCB, Apple Pay 以及 PayPal。",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{`${product.title} | ${product.brand} | KÉSH de¹`}</title>
        <meta name="description" content={product.shortDescPlain} />
        <link rel="canonical" href={currentUrl} />

        {/* --- 🔥 強化 OG Tags (加上 key 確保覆蓋全站預設) --- */}
        <meta
          property="og:title"
          content={`${product.title} | KÉSH de¹`}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={product.shortDescPlain}
          key="ogdesc"
        />
        <meta property="og:url" content={currentUrl} key="ogurl" />
        <meta property="og:type" content="product" key="ogtype" />
        <meta property="og:image" content={ogImage} key="ogimage" />
        <meta
          property="og:image:secure_url"
          content={ogImage}
          key="ogimagesecure"
        />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="2560" />

        {/* Twitter 分享卡片 */}
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta name="twitter:image" content={ogImage} key="twimage" />

        {/* 結構化資料 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </Head>

      <main className="bg-white text-black min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          {/* items-start 是讓左右兩邊高度獨立，左側能 Sticky 的關鍵 */}
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
            {/* --- 🔥 左側：圖片輪播系統 (Sticky 固定) --- */}
            <div className="w-full md:w-[55%] lg:w-[60%] md:sticky md:top-32 overflow-hidden z-10">
              {/* 大圖 Swiper */}
              <Swiper
                style={{
                  "--swiper-navigation-color": "#000",
                  "--swiper-pagination-color": "#000",
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full aspect-[4/5] bg-gray-50 mb-4 rounded-sm"
              >
                {product.images?.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-full cursor-grab active:cursor-grabbing">
                      <Image
                        src={img}
                        alt={`${product.title} - ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* 下方小圖 (Thumbnails) Swiper */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full h-24 md:h-28 thumb-swiper"
                breakpoints={{
                  640: { slidesPerView: 5 },
                  1024: { slidesPerView: 6 },
                }}
              >
                {product.images?.map((img, idx) => (
                  <SwiperSlide
                    key={idx}
                    className="cursor-pointer opacity-50 [&.swiper-slide-thumb-active]:opacity-100 transition-opacity"
                  >
                    <div className="relative w-full h-full border border-transparent hover:border-gray-200 transition-colors bg-white">
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* --- 右側：商品資訊與 FAQ (隨滾輪向下捲動) --- */}
            <div className="w-full md:w-[45%] lg:w-[40%] pb-10">
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {product.brand}
                  </span>
                  <span className="bg-black text-white text-[10px] px-2 py-1 font-bold">
                    {product.specs.rank}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-medium mb-3">
                  {product.title}
                </h1>

                {/* 星星顯示 (SEO) */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={
                          i < Math.round(product.averageRating || 5)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    ({product.ratingCount || 1} REVIEWS)
                  </span>
                </div>

                <p className="text-2xl font-bold tracking-tight text-black">
                  {product.price}
                </p>
              </div>

              {/* --- 🔥 串接 JSON 裡的 product_condition (商品狀況) --- */}
              {product.productCondition && (
                <div className="bg-gray-50 border border-gray-100 p-5 mb-8 rounded-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-gray-800">
                    <CheckCircle2 size={16} className="text-[#ef4628]" />
                    Item Condition (商品狀況)
                  </h4>
                  <div
                    className="text-[13px] text-gray-600 leading-relaxed [&>p]:mb-2 font-medium"
                    dangerouslySetInnerHTML={{
                      __html: product.productCondition,
                    }}
                  />
                </div>
              )}

              {/* 購買操作區 */}
              <div className="mb-10 space-y-4">
                <div className="flex gap-4">
                  <div className="flex border border-gray-300 w-28 justify-between items-center px-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="py-3 px-2 text-gray-400 hover:text-black transition-colors outline-none focus:outline-none"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="py-3 px-2 text-gray-400 hover:text-black transition-colors outline-none focus:outline-none"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 bg-[#ef4628] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 active:scale-95 focus:outline-none"
                  >
                    {ui.btn_buy || "加入購物車"}
                  </button>
                </div>
              </div>

              {/* --- 🔥 串接 JSON 裡的 description (尺寸、材質、配件等) --- */}
              {product.description && (
                <div className="mb-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-gray-100">
                    Product Details (商品細節)
                  </h3>
                  <div
                    className="text-[13px] text-gray-700 leading-8 tracking-wide
                               [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>h3]:font-bold [&>h3]:mb-2 [&>strong]:text-black"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* --- FAQ 區塊 --- */}
              <div className="pt-8 border-t border-black">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Info size={14} className="text-[#ef4628]" />
                  Shopping Guide & FAQ
                </h3>
                <div className="space-y-1">
                  <FAQAccordion
                    question="關於代購品牌"
                    answer="我們專門提供 Hermès, Chanel, Louis Vuitton, Dior 等國際一線精品代購與寄賣服務。"
                  />
                  <FAQAccordion
                    question="付款與安全"
                    answer="支援 VISA, MasterCard, JCB, Apple Pay 以及 PayPal 等多種支付方式，交易安全有保障。"
                  />
                  <FAQAccordion
                    question="配送與運費"
                    answer="宅配或 7-11 店到店運費為 NT$80，精品類強烈建議採用宅配以確保運輸安全。"
                  />
                  <FAQAccordion
                    question="正品保證"
                    answer="所有商品均經過嚴格真品鑑定，並附上相關配件，保障消費者的購買權益。"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ===================== 伺服器端數據獲取 =====================
export async function getStaticProps({ params, locale }) {
  const currentLang = locale || "zh-TW";
  const wpLang = currentLang === "zh-TW" ? "zh" : currentLang;
  const { WC_SITE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString(
    "base64",
  );
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const res = await fetch(
      `${WC_SITE_URL}/wp-json/wc/v3/products?slug=${params.slug}&lang=${wpLang}`,
      { agent, headers },
    );
    const products = await res.json();

    if (!products || products.length === 0) {
      return { notFound: true };
    }

    const p = products[0];

    // 🔥 完美對應 JSON 資料格式
    // 🔥 完美對應 JSON 資料格式
    const formattedProduct = {
      id: p.id,
      slug: p.slug,
      sku: p.sku || `KESH-${p.id}`,
      title: p.name || "",
      price: `NT$ ${parseInt(p.price || 0).toLocaleString()}`,
      rawPrice: parseInt(p.price || 0),
      brand:
        p.attributes?.find((a) => a.name.toLowerCase() === "brand")
          ?.options[0] || "KÉSH de¹ Select",

      // 👇 修改這裡：清除 WordPress 編輯器自動產生的多餘空白段落 <p>&nbsp;</p>
      description: (p.description || "").replace(
        /<p>(&nbsp;|<br\s*\/?>|\s)*<\/p>/gi,
        "",
      ),

      // ✅ 抓取獨立的 product_condition (全新品 等級)
      productCondition: p.product_condition || "",

      // ✅ 抓取短述 (簡短描述)
      shortDescHtml: p.short_description || "",
      shortDescPlain:
        p.short_description
          ?.replace(/<[^>]+>/g, "")
          .slice(0, 150)
          .trim() || "",

      // ✅ 抓取圖片陣列的 src，不隨便 replace 以免破壞網址
      images: p.images?.map((img) => img.src) || [],

      averageRating: parseFloat(p.average_rating || 0),
      ratingCount: parseInt(p.rating_count || 0),
      specs: {
        rank:
          p.attributes?.find((a) => a.name.toLowerCase() === "rank")
            ?.options[0] || "Rank S",
        inStoreView: p.stock_status === "instock",
      },
    };

    return {
      props: {
        product: formattedProduct,
        ...(await serverSideTranslations(currentLang, ["common"])),
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Fetch Error:", e);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
