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
import { FreeMode, Navigation, Thumbs, Mousewheel } from "swiper/modules";
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

// 🔥 引入自定義的 HeroSlider
import HeroSlider from "../../components/HeroSlider";

// --- 共用商品卡片組件 (用於推薦輪播) ---
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col bg-white border border-gray-100 hover:border-gray-300 transition-colors h-full"
    >
      <div
        className="relative w-full aspect-[4/5] bg-[#f4f4f4] overflow-hidden cursor-crosshair"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCursorPos({ x: 50, y: 50 });
        }}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="text-[10px] font-bold text-gray-500 border border-gray-400 px-1.5 py-0.5 rounded bg-white/80 backdrop-blur-sm">
            {product.status}
          </span>
        </div>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url('${product.image || "/images/placeholder.jpg"}')`,
            transform: isHovered ? "scale(1.15)" : "scale(1)",
            transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`,
          }}
        ></div>
      </div>
      <div className="p-4 bg-white mt-auto flex flex-col gap-1">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
          {product.brand}
        </div>
        <h2 className="text-[13px] font-medium text-gray-900 leading-snug tracking-wide group-hover:text-[#ef4628] transition-colors line-clamp-2">
          {product.title}
        </h2>
        <div className="mt-2 flex items-center justify-between pt-2">
          <p className="text-[14px] font-bold text-black tracking-wide">
            {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

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

// ===================== 主頁面組件 =====================
export default function ProductDetail({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const ui = t("product_detail.ui", { returnObjects: true });

  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("features");

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
  const ogImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : `${SITE_URL}/default-og-image.jpg`;

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
    ],
  };

  return (
    <>
      <Head>
        <title>{`${product.title} | ${product.brand} | KÉSH de¹`}</title>
        <meta name="description" content={product.shortDescPlain} />
        <link rel="canonical" href={currentUrl} />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </Head>

      <main className="bg-white text-black min-h-screen pt-24 md:pt-32 pb-0">
        {/* ===================== 上半部：商品輪播與購買資訊 ===================== */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
            {/* 左側：主圖片輪播 */}
            <div className="w-full md:w-[55%] lg:w-[60%] md:sticky md:top-32 overflow-hidden z-10">
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

            {/* 右側：商品資訊 */}
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

              {product.productCondition && (
                <div className="bg-gray-50 border border-gray-100 p-5 mb-8 rounded-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-gray-800">
                    <CheckCircle2 size={16} className="text-[#ef4628]" /> Item
                    Condition (商品狀況)
                  </h4>
                  <div
                    className="text-[13px] text-gray-600 leading-relaxed [&>p]:mb-2 font-medium"
                    dangerouslySetInnerHTML={{
                      __html: product.productCondition,
                    }}
                  />
                </div>
              )}

              <div className="mb-10 space-y-4">
                <div className="flex gap-4">
                  <div className="flex border border-gray-300 w-28 justify-between items-center px-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="py-3 px-2 text-gray-400 hover:text-black transition-colors outline-none"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="py-3 px-2 text-gray-400 hover:text-black transition-colors outline-none"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 bg-[#ef4628] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 active:scale-95"
                  >
                    {ui.btn_buy || "加入購物車"}
                  </button>
                </div>
              </div>

              {product.description && (
                <div className="mb-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 pb-2 border-b border-gray-100">
                    Product Details (商品細節)
                  </h3>
                  <div
                    className="text-[13px] text-gray-700 leading-8 tracking-wide [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>h3]:font-bold [&>h3]:mb-2 [&>strong]:text-black"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* FAQ 區塊 */}
              <div className="pt-8 border-t border-black">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Info size={14} className="text-[#ef4628]" /> Shopping Guide &
                  FAQ
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 下半部：Tabs 內容切換區塊 ===================== */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 mt-20 pt-10 border-t border-gray-200">
          <div className="flex justify-center gap-8 md:gap-16 border-b border-gray-200 mb-10">
            <button
              onClick={() => setActiveTab("features")}
              className={`pb-4 text-sm md:text-base font-bold uppercase tracking-widest transition-colors relative ${activeTab === "features" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
            >
              產品特色
              {activeTab === "features" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-4 text-sm md:text-base font-bold uppercase tracking-widest transition-colors relative ${activeTab === "shipping" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
            >
              退換貨及運送須知
              {activeTab === "shipping" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                />
              )}
            </button>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* 特色 Tab 內容 */}
              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full rounded-xl overflow-hidden shadow-sm relative">
                    <HeroSlider
                      carouselSlides={[
                        {
                          title: "KÉSH de¹ 嚴選品質保證",
                          image:
                            "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_7.jpg",
                        },
                        {
                          title: "每一件商品皆由專業鑑定師嚴格把關",
                          image:
                            "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_10.jpg",
                        },
                      ]}
                    />
                  </div>
                </motion.div>
              )}

              {/* 退換貨及運送須知 Tab 內容 */}
              {activeTab === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto text-[14px] leading-8 text-gray-700 space-y-8 pb-10"
                >
                  <section>
                    <h3 className="text-lg font-bold text-black mb-3">
                      運送方式與時間
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>現貨商品：</strong>確認付款後，將於 1-3
                        個工作天內為您妥善包裝並寄出。
                      </li>
                      <li>
                        <strong>預購商品：</strong>依品牌及款式不同，約需 14-30
                        個工作天到貨。
                      </li>
                      <li>
                        <strong>高單價精品：</strong>為確保安全，NT$50,000
                        以上商品一律採用保值快遞或建議面交。
                      </li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-black mb-3">
                      退換貨政策
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>二手/古董商品：</strong>
                        因商品具有唯一性，除經鑑定為仿冒品外，恕不接受個人因素（如尺寸不合、微小使用痕跡）退換貨。
                      </li>
                      <li>
                        <strong>全新品：</strong>
                        享有七天鑑賞期（非試用期）。退回商品必須維持「全新未剪標、防偽扣環未拆」。
                      </li>
                    </ul>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================== 推薦商品輪播區塊 ===================== */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 bg-[#fafafa] py-20 mt-10">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-wide uppercase mb-2">
                    You May Also Like
                  </h2>
                  <p className="text-sm text-gray-500 tracking-widest uppercase">
                    為您推薦其他嚴選商品
                  </p>
                </div>
                <Link
                  href="/category/all"
                  className="hidden md:inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#ef4628] hover:border-[#ef4628] transition-colors"
                >
                  View All
                </Link>
              </div>

              <Swiper
                slidesPerView={2}
                spaceBetween={20}
                freeMode={true}
                mousewheel={{ forceToAxis: true, sensitivity: 1 }}
                breakpoints={{
                  640: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 30 },
                  1280: { slidesPerView: 5, spaceBetween: 30 },
                }}
                modules={[FreeMode, Mousewheel]}
                className="w-full !pb-10"
              >
                {relatedProducts.map((p) => (
                  <SwiperSlide key={p.id} className="h-auto">
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

// ===================== 伺服器端數據獲取 =====================
export async function getStaticProps({ params, locale }) {
  const currentLang = locale || "zh-TW";
  const wpLang = currentLang === "zh-TW" ? "zh" : currentLang;
  const { WC_SITE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  if (!WC_SITE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return { notFound: true };
  }

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString(
    "base64",
  );
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    let targetSlug = params.slug;

    // 🔥 智慧 Slug 轉換邏輯
    // 假設您的後台設定是：中文(沒後綴), 英文(-en), 韓文(-ko)
    if (wpLang === "en" && !targetSlug.endsWith("-en")) {
      targetSlug = `${targetSlug}-en`;
    } else if (wpLang === "ko" && !targetSlug.endsWith("-ko")) {
      targetSlug = `${targetSlug}-ko`;
    } else if (wpLang === "zh") {
      // 如果切回中文，把 -en 或 -ko 拔掉
      targetSlug = targetSlug.replace(/-en$/, "").replace(/-ko$/, "");
    }

    // 用轉換後的 slug 去跟 API 拿資料
    const productUrl = `${WC_SITE_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(targetSlug)}&lang=${wpLang}`;
    const res = await fetch(productUrl, { agent, headers });
    const products = await res.json();

    if (!Array.isArray(products) || products.length === 0) {
      console.warn(
        `[Warning] 找不到商品。嘗試請求的 Slug: ${targetSlug}, 語系: ${wpLang}`,
      );
      // 如果智慧轉換失敗，為了不讓頁面白屏，您可以選擇回傳 notFound: true
      // 或者 fallback 去抓沒有後綴的原始 slug (視您後台實際設定而定)
      return { notFound: true };
    }

    const p = products[0];

    // --- 抓取其他推薦商品 ---
    let relatedProducts = [];
    const categoryId =
      p.categories && p.categories.length > 0 ? p.categories[0].id : null;
    let relatedUrl = `${WC_SITE_URL}/wp-json/wc/v3/products?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}&lang=${wpLang}&status=publish&per_page=8&exclude=[${p.id}]`;
    if (categoryId) relatedUrl += `&category=${categoryId}`;

    const relatedRes = await fetch(relatedUrl, { agent });

    if (relatedRes.ok) {
      const rawRelated = await relatedRes.json();
      if (Array.isArray(rawRelated)) {
        relatedProducts = rawRelated.map((rp) => {
          let imageUrl = null;
          if (rp.images && rp.images.length > 0) imageUrl = rp.images[0].src;
          return {
            id: rp.id,
            slug: rp.slug,
            title: rp.name.toUpperCase(),
            brand:
              rp.attributes?.find((a) => a.name.toLowerCase() === "brand")
                ?.options[0] || "KÉSH de¹",
            price: `NT$ ${parseInt(rp.price || 0).toLocaleString()}`,
            status: rp.stock_status === "instock" ? "RANK S" : "SOLD",
            image: imageUrl,
          };
        });
      }
    }

    // --- 格式化主商品資料 ---
    const formattedProduct = {
      id: p.id,
      slug: p.slug, // 這裡拿到的會是加上後綴的真正 slug
      sku: p.sku || `KESH-${p.id}`,
      title: p.name || "",
      price: `NT$ ${parseInt(p.price || 0).toLocaleString()}`,
      rawPrice: parseInt(p.price || 0),
      brand:
        p.attributes?.find((a) => a.name.toLowerCase() === "brand")
          ?.options[0] || "KÉSH de¹ Select",
      description: (p.description || "").replace(
        /<p>(&nbsp;|<br\s*\/?>|\s)*<\/p>/gi,
        "",
      ),
      productCondition: p.product_condition || "",
      shortDescHtml: p.short_description || "",
      shortDescPlain:
        p.short_description
          ?.replace(/<[^>]+>/g, "")
          .slice(0, 150)
          .trim() || "",
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
        relatedProducts: relatedProducts,
        ...(await serverSideTranslations(currentLang, ["common"])),
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Fetch Error in Product Detail:", e);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
