import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import https from "https"; // 用於後端抓取資料

// --- Swiper ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// 假設路徑
import { useCart } from "@/components/context/CartContext";

// --- Toast Component ---
const SuccessToast = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[3000] bg-black text-white px-6 py-3 rounded shadow-lg flex items-center gap-3"
      >
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-sm font-medium tracking-wide">
          已成功加入購物袋
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- 🔥 Main Component ---
export default function ProductDetail({ product, relatedProducts }) {
  const router = useRouter();

  // State
  const [quantity, setQuantity] = useState(1);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔥 新增：收藏商品狀態
  const [isFavorite, setIsFavorite] = useState(false);

  // Cart Hook
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
    if (isPolicyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPolicyModalOpen]);

  // Loading State for Fallback
  if (router.isFallback) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-gray-500">
          LOADING PRODUCT...
        </p>
      </div>
    );
  }

  if (!product) return null;

  // --- 🌟 SEO & Structured Data Logic ---

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.cieman.com.tw";
  const currentUrl = `${siteUrl}/product/${product.slug}`;
  // 圖片處理：如果沒有圖片，使用預設圖
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : `${siteUrl}/images/placeholder.jpg`;

  // 1. Product Schema (商品結構化資料)
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.shortDesc,
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: currentUrl,
      priceCurrency: "TWD",
      price: product.rawPrice,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/UsedCondition",
      availability: product.specs.inStoreView
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "KÉSH de¹",
      },
    },
  };

  // 2. BreadcrumbList Schema (麵包屑結構化資料)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Online Store",
        item: `${siteUrl}/category`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: currentUrl,
      },
    ],
  };

  // Handler
  const handleQtyChange = (type) => {
    if (type === "minus" && quantity > 1) setQuantity(quantity - 1);
    if (type === "plus") setQuantity(quantity + 1);
  };

  const handleBuy = () => {
    if (addToCart) {
      addToCart(product, quantity);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      <Head>
        <title>{`${product.title} | KÉSH de¹`}</title>
        <meta name="description" content={product.shortDesc} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.title} | KÉSH de¹`} />
        <meta property="og:description" content={product.shortDesc} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="KÉSH de¹" />
        <meta property="og:price:amount" content={product.rawPrice} />
        <meta property="og:price:currency" content="TWD" />
        <meta property="og:image" content={mainImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={product.title} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={product.shortDesc} />
        <meta name="twitter:image" content={mainImage} />

        {/* JSON-LD Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>

      <SuccessToast show={showToast} />

      <main className="bg-white text-black font-sans min-h-screen pb-20 pt-24 md:pt-32 relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 md:mb-10 font-medium tracking-wide">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link
              href="/category"
              className="hover:text-black transition-colors"
            >
              ONLINE STORE
            </Link>
            <span>/</span>
            <span className="text-black border-b border-black cursor-default">
              {product.brand}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
            {/* Left: Images */}
            <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col gap-1 md:gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((imgUrl, index) => (
                  <div key={index} className="w-full relative">
                    {/* 使用 unoptimized 避免 Next.js 對外部圖片權限的限制，方便除錯 */}
                    <Image
                      src={imgUrl}
                      alt={`${product.title} - view ${index + 1}`}
                      width={1200}
                      height={1500}
                      className="w-full h-auto object-cover block"
                      priority={index === 0}
                      unoptimized={true}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full bg-gray-100 aspect-[4/5] flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-[40%] lg:w-[35%]">
              <div className="sticky top-32">
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {product.brand}
                    </span>
                    <span className="bg-black text-white text-[10px] px-2 py-1 font-bold tracking-widest">
                      {product.specs.rank}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-medium uppercase leading-tight mb-4 text-gray-900">
                    {product.title}
                  </h1>
                  <p className="text-xl font-bold tracking-wide text-black">
                    {product.price}
                  </p>
                </div>

                {/* 🔥 CTA Buttons Section 修改區域 */}
                <div className="mb-8">
                  {/* 新增：急迫性提示文字 */}
                  <p className="text-[13px] text-[#ef4628] font-bold tracking-wider mb-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#ef4628] rounded-full inline-block animate-pulse"></span>
                    單件商品，售出即下架
                  </p>

                  <div className="flex gap-4 mb-4 h-[50px]">
                    {/* 數量 */}
                    <div className="flex w-[120px] border border-gray-300 items-center justify-between px-3">
                      <button
                        onClick={() => handleQtyChange("minus")}
                        className="text-gray-400 hover:text-black text-lg p-2 disabled:opacity-30"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-full text-center text-sm font-bold bg-transparent border-none outline-none text-black"
                      />
                      <button
                        onClick={() => handleQtyChange("plus")}
                        className="text-gray-400 hover:text-black text-lg p-2"
                      >
                        +
                      </button>
                    </div>
                    {/* 立即購買 */}
                    <button
                      onClick={handleBuy}
                      className="flex-1 bg-[#ef4628] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#d63a1f] transition-all duration-300 shadow-md active:scale-95"
                    >
                      立即購買
                    </button>
                  </div>

                  {/* LINE 快速詢問 */}
                  <a
                    href="https://line.me/ti/p/yourlineid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-black bg-white text-black text-center py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 10.304c0-5.687-5.373-10.304-12-10.304S0 4.617 0 10.304c0 5.068 4.27 9.306 10.029 10.156.389.085.917.26.917.601 0 .208-.056.783-.184 1.442-.166.857-.765 2.341-.981 2.845-.059.139.017.346.203.346.112 0 .245-.029.393-.076 3.281-1.056 7.155-4.212 8.351-5.79C21.873 17.58 24 14.159 24 10.304z" />
                    </svg>
                    LINE 快速詢問
                  </a>

                  {/* 新增：收藏商品 按鈕 */}
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-full border text-center py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                      ${isFavorite ? "border-[#ef4628] text-[#ef4628] bg-red-50" : "border-gray-300 text-gray-600 hover:border-black hover:text-black"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {isFavorite ? "已收藏商品" : "收藏商品"}
                  </button>
                </div>
                {/* 🔥 CTA Buttons Section 修改結束 */}

                <div className="mb-6">
                  <div
                    className={`text-[13px] text-gray-600 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${isDescExpanded ? "max-h-[800px]" : "max-h-[60px]"}`}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs font-bold uppercase tracking-wider text-black mt-2 hover:text-[#ef4628] flex items-center gap-1"
                  >
                    {isDescExpanded ? "READ LESS" : "READ MORE"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transform transition-transform ${isDescExpanded ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>

                {/* Specs */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                    className="flex justify-between items-center w-full text-sm font-bold uppercase tracking-widest mb-4 hover:text-[#ef4628]"
                  >
                    商品狀況
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transform transition-transform ${isSpecsOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isSpecsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#f9f9f9] p-5 border border-gray-100 mb-2">
                          <div
                            className="text-[13px] text-gray-600 leading-relaxed mb-4 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>strong]:text-black"
                            dangerouslySetInnerHTML={{
                              __html:
                                product.specs.conditionText ||
                                "<p>暫無商品狀況描述。</p>",
                            }}
                          />
                          <div className="pt-2 mt-2 border-t border-gray-200">
                            <span
                              className={`block font-medium text-sm ${product.specs.inStoreView ? "text-[#06c755]" : "text-gray-400"}`}
                            >
                              {product.specs.inStoreView
                                ? "● 可預約現場鑑賞"
                                : "○ 僅限線上諮詢"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => setIsPolicyModalOpen(true)}
                    className="flex justify-between items-center w-full text-sm font-bold uppercase tracking-widest hover:text-[#ef4628]"
                  >
                    Shopping Guide / Returns
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section className="max-w-[1000px] mx-auto px-6 mb-24 border-t border-gray-200 pt-16">
          <div className="flex justify-center border-b border-gray-200 mb-10">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 px-8 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${activeTab === "details" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              Details Info
              {activeTab === "details" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-4 px-8 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${activeTab === "shipping" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              Shopping & Returns
              {activeTab === "shipping" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
              )}
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === "details" && (
              <div className="animate-fadeIn">
                <div className="w-full h-[300px] bg-gray-100 mb-8 flex items-center justify-center overflow-hidden relative">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt="Product Banner"
                      fill
                      className="object-cover opacity-90"
                      unoptimized={true}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10"></div>
                  <h3 className="relative z-10 text-white text-3xl font-light tracking-widest uppercase">
                    Classic Elegance
                  </h3>
                </div>
                <div className="prose prose-stone mx-auto text-center max-w-2xl">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-wide">
                    關於 {product.title}
                  </h3>
                  <div
                    className="text-gray-600 leading-relaxed mb-6 text-sm"
                    dangerouslySetInnerHTML={{ __html: product.intro }}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 p-6">
                      <h4 className="font-bold text-sm mb-2">
                        {product.specs.material}
                      </h4>
                      <p className="text-xs text-gray-500">
                        頂級材質，觸感柔軟且耐磨。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                      <h4 className="font-bold text-sm mb-2">
                        {product.specs.hardware}
                      </h4>
                      <p className="text-xs text-gray-500">
                        經典五金配件，增添高貴光澤。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="animate-fadeIn max-w-2xl mx-auto">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold border-l-4 border-black pl-3 mb-3 uppercase">
                      購買須知
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                      <li>
                        所有商品皆為二手或全新閒置精品，請務必確認品況後再行購買。
                      </li>
                      <li>
                        商品照片皆為實物拍攝，因螢幕顯示可能有些微色差，以實品為主。
                      </li>
                      <li>我們提供 100% 正品保證，若驗出贗品將全額退款。</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold border-l-4 border-black pl-3 mb-3 uppercase">
                      退換貨政策
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      由於精品買賣的特殊性，
                      <strong>
                        售出後除真偽問題外，恕不接受任何理由退換貨。
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recommendations */}
        <section className="others-products max-w-[1440px] mx-auto px-6 md:px-10 border-t border-gray-200 pt-16">
          <h2 className="text-2xl md:text-[28px] font-normal uppercase tracking-wide mb-10">
            Recommend Items
          </h2>
          {relatedProducts && relatedProducts.length > 0 ? (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={2}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{ 768: { slidesPerView: 4 } }}
              className="w-full"
            >
              {relatedProducts.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link
                    href={`/product/${item.slug}`}
                    className="block group cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/5] bg-[#f4f4f4] mb-4 overflow-hidden">
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span
                          className={`w-2 h-2 rounded-full ${item.tagColor === "red" ? "bg-[#ef4628]" : "bg-black"}`}
                        ></span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-800">
                          {item.tag}
                        </span>
                      </div>
                      {item.image ? (
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url('${item.image}')` }}
                        ></div>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold uppercase leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 underline decoration-gray-300 underline-offset-2 mb-2">
                        {item.brand}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[13px] font-medium ${item.tag === "SALE" ? "text-[#ef4628]" : "text-black"}`}
                        >
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-gray-400 text-sm">暫無推薦商品</div>
          )}
        </section>

        {/* Modal */}
        {mounted &&
          createPortal(
            <AnimatePresence>
              {isPolicyModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPolicyModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    className="relative z-10 bg-white w-full max-w-[600px] shadow-2xl p-8 md:p-10 max-h-[85vh] overflow-y-auto rounded-sm"
                  >
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 sticky top-0 bg-white z-20">
                      <h3 className="text-xl font-bold uppercase tracking-widest">
                        Shopping Guide
                      </h3>
                      <button
                        onClick={() => setIsPolicyModalOpen(false)}
                        className="hover:rotate-90 transition-transform duration-300 p-2 -mr-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
                      <div>
                        <h4 className="font-bold text-black mb-3 uppercase tracking-wide border-l-4 border-black pl-3">
                          購買須知
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            所有商品皆為二手或全新閒置精品，請務必確認品況後再行購買。
                          </li>
                          <li>
                            商品照片皆為實物拍攝，因螢幕顯示可能有些微色差，以實品為主。
                          </li>
                        </ul>
                      </div>
                      <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                        <button
                          onClick={() => setIsPolicyModalOpen(false)}
                          className="bg-black text-white px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors"
                        >
                          I Understand
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </main>
    </>
  );
}

// --- 🔥 SSG: 預先生成路徑 ---
export async function getStaticPaths() {
  const WC_URL = process.env.WC_SITE_URL;
  const CK = process.env.WC_CONSUMER_KEY;
  const CS = process.env.WC_CONSUMER_SECRET;

  // 為了安全起見，這裡也使用 Header 驗證方式抓取路徑
  const auth = Buffer.from(`${CK}:${CS}`).toString("base64");
  const agent = new https.Agent({ rejectUnauthorized: false });
  const headers = {
    "User-Agent": "Mozilla/5.0 (Next.js)",
    Authorization: `Basic ${auth}`,
  };

  let paths = [];

  try {
    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/products?per_page=20&status=publish`,
      { agent, headers },
    );

    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        paths = products.map((product) => ({
          params: { slug: product.slug },
        }));
      }
    }
  } catch (err) {
    console.error("Failed to pre-fetch paths:", err);
  }

  return { paths, fallback: "blocking" };
}

// --- 🔥 ISR: 靜態生成 + 增量更新 (修復圖片抓取) ---
export async function getStaticProps({ params }) {
  const WC_URL = process.env.WC_SITE_URL;
  const CK = process.env.WC_CONSUMER_KEY;
  const CS = process.env.WC_CONSUMER_SECRET;
  const slug = params.slug;

  const agent = new https.Agent({ rejectUnauthorized: false });
  // 使用 Header 驗證 (解決 401)
  const auth = Buffer.from(`${CK}:${CS}`).toString("base64");
  const headers = {
    "User-Agent": "Mozilla/5.0 (Next.js)",
    Accept: "application/json",
    Authorization: `Basic ${auth}`,
  };

  try {
    // 1. 抓取主要商品
    const apiUrl = `${WC_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(apiUrl, { agent, headers });

    if (!res.ok) throw new Error("Fetch failed");
    const products = await res.json();

    if (!products || products.length === 0) {
      return { notFound: true };
    }

    const p = products[0];

    // 2. 抓取相關商品 (排除自己)
    const relatedApiUrl = `${WC_URL}/wp-json/wc/v3/products?exclude=${p.id}&per_page=8&category=${p.categories[0]?.id || ""}`;
    const relatedRes = await fetch(relatedApiUrl, { agent, headers });
    const relatedData = await relatedRes.json();

    const formattedRelated = Array.isArray(relatedData)
      ? relatedData.map((item) => {
          const brandAttr = item.attributes.find(
            (a) => a.name.toLowerCase() === "brand",
          );
          const brandName = brandAttr
            ? brandAttr.options[0]
            : "KÉSH de¹ Select";

          // 🔥 相關商品圖片處理
          let relatedImg = null;
          if (item.images && item.images.length > 0) {
            relatedImg = item.images[0].src;
            if (relatedImg.startsWith("http://"))
              relatedImg = relatedImg.replace("http://", "https://");
          }

          return {
            id: item.id,
            slug: item.slug,
            title: item.name.toUpperCase(),
            brand: brandName,
            price: `NT$ ${parseInt(item.price || 0).toLocaleString()}`,
            image: relatedImg,
            tag: item.on_sale ? "SALE" : "NEW",
            tagColor: item.on_sale ? "red" : "black",
          };
        })
      : [];

    // Helper functions
    const getAttr = (name) => {
      const attr = p.attributes.find(
        (a) => a.name.toLowerCase() === name.toLowerCase(),
      );
      return attr ? attr.options[0] : null;
    };

    const conditionText = p.product_condition || p.description || "";
    const rawPrice = parseInt(p.price || 0);

    // 🔥 主要商品圖片處理 (建立陣列)
    let productImages = [];
    if (p.images && p.images.length > 0) {
      productImages = p.images.map((img) => {
        let src = img.src;
        if (src.startsWith("http://")) src = src.replace("http://", "https://");
        return src;
      });
    }

    const formattedProduct = {
      id: p.id,
      slug: p.slug,
      title: p.name.toUpperCase(),
      price: `NT$ ${rawPrice.toLocaleString()}`,
      rawPrice: rawPrice,
      brand: getAttr("Brand") || "KÉSH de¹ Select",
      description: p.description || "",
      intro: p.short_description || "",
      shortDesc: (p.short_description || "")
        .replace(/<[^>]+>/g, "")
        .slice(0, 150)
        .replace(/\s+/g, " ")
        .trim(),
      images: productImages, // 傳入處理過的圖片陣列
      specs: {
        rank: getAttr("Rank") || "Rank S",
        conditionText: conditionText,
        material: getAttr("Material") || "Leather",
        hardware: getAttr("Hardware") || "Gold/Silver",
        inStoreView: p.stock_status === "instock",
      },
    };

    return {
      props: {
        product: formattedProduct,
        relatedProducts: formattedRelated,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Product detail fetch error:", error);
    return { notFound: true };
  }
}
