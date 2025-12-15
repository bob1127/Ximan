import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import https from "https"; // 用於後端抓取資料

// --- Swiper 相關引入 ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css"; // 基本樣式

// 假設您的 CartContext 路徑如下，請依實際情況調整
import { useCart } from "@/components/context/CartContext";

// --- ✅ 成功加入購物車的 Toast 組件 ---
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

// --- 🔥 主頁面組件 ---
export default function ProductDetail({ product, relatedProducts }) {
  const router = useRouter();

  // 狀態管理
  const [quantity, setQuantity] = useState(1);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 購物車 Hook
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

  // Loading
  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 防止沒有資料時報錯
  if (!product) return null;

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
        <title>{product.title} | CIÉMAN</title>
        <meta name="description" content={product.shortDesc} />
      </Head>

      {/* ✅ 顯示 Toast */}
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
            {/* Left: Images (Dynamic) */}
            <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col gap-1 md:gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((imgUrl, index) => (
                  <div key={index} className="w-full relative">
                    <Image
                      src={imgUrl}
                      alt={`${product.title} - ${index + 1}`}
                      width={1200}
                      height={1500}
                      className="w-full h-auto object-cover block"
                      priority={index === 0}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full bg-gray-100 aspect-[4/5] flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Right: Info (Sticky) */}
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

                <div className="mb-8">
                  <div className="flex gap-4 mb-4 h-[50px]">
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

                    <button
                      onClick={handleBuy}
                      className="flex-1 bg-[#ef4628] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#d63a1f] transition-all duration-300 shadow-md active:scale-95"
                    >
                      立即購買
                    </button>
                  </div>
                  <a
                    href="https://line.me/ti/p/yourlineid" // 請替換成您的 LINE 連結
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-black bg-white text-black text-center py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
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
                </div>

                <div className="mb-6">
                  {/* 側邊欄：完整說明 (description) */}
                  <div
                    className={`text-[13px] text-gray-600 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${
                      isDescExpanded ? "max-h-[800px]" : "max-h-[60px]"
                    }`}
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
                      className={`transform transition-transform ${
                        isDescExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>

                {/* 商品狀況區塊 (ACF) */}
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
                      className={`transform transition-transform ${
                        isSpecsOpen ? "rotate-180" : ""
                      }`}
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
                            className="
                              text-[13px] text-gray-600 leading-relaxed mb-4 
                              [&>p]:mb-2              
                              [&>ul]:list-disc [&>ul]:pl-5             
                              [&>ol]:list-decimal [&>ol]:pl-5             
                              [&>strong]:text-black [&>strong]:font-bold    
                              [&>h4]:text-sm [&>h4]:font-bold [&>h4]:mt-2
                            "
                            dangerouslySetInnerHTML={{
                              __html:
                                product.specs.conditionText ||
                                "<p>暫無商品狀況描述，請聯繫客服詢問。</p>",
                            }}
                          />
                          <div className="pt-2 mt-2 border-t border-gray-200">
                            <span
                              className={`block font-medium text-sm ${
                                product.specs.inStoreView
                                  ? "text-[#06c755]"
                                  : "text-gray-400"
                              }`}
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

        {/* ========== Tabs 產品內文切換區塊 (保持不變) ========== */}
        <section className="max-w-[1000px] mx-auto px-6 mb-24 border-t border-gray-200 pt-16">
          <div className="flex justify-center border-b border-gray-200 mb-10">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 px-8 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === "details"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Details Info
              {activeTab === "details" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-4 px-8 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === "shipping"
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
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
                  {/* 下方 Tab：簡短說明 (intro) */}
                  <div
                    className="text-gray-600 leading-relaxed mb-6 text-sm"
                    dangerouslySetInnerHTML={{ __html: product.intro }}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 p-6">
                      <h4 className="font-bold text-sm mb-2">
                        {product.specs.material || "Material"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        頂級材質，觸感柔軟且耐磨。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                      <h4 className="font-bold text-sm mb-2">
                        {product.specs.hardware || "Hardware"}
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
                        售出後除真偽問題外，恕不接受任何理由（如不喜歡、尺寸不合等）退換貨。
                      </strong>
                      建議您購買前透過 LINE
                      官方帳號索取更多細節照片或預約現場看包。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== 🔥🔥🔥 Recommend Items (改為 Swiper 自動輪播) 🔥🔥🔥 ========== */}
        <section className="others-products max-w-[1440px] mx-auto px-6 md:px-10 border-t border-gray-200 pt-16">
          <h2 className="text-2xl md:text-[28px] font-normal uppercase tracking-wide mb-10">
            Recommend Items
          </h2>

          {/* 如果沒有相關商品，顯示提示或空 */}
          {relatedProducts && relatedProducts.length > 0 ? (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16} // 對應原本的 gap-x-4
              slidesPerView={2} // 手機版顯示 2 個
              loop={true} // 無限循環
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 4, // 電腦版顯示 4 個
                },
              }}
              className="w-full"
            >
              {relatedProducts.map((item) => (
                <SwiperSlide key={item.id}>
                  {/* 使用 Next/Link 包覆整個 Card 讓它可點擊跳轉 (可選) */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="block group cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/5] bg-[#f4f4f4] mb-4 overflow-hidden">
                      {/* Tag */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.tagColor === "red"
                              ? "bg-[#ef4628]"
                              : "bg-black"
                          }`}
                        ></span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-800">
                          {item.tag}
                        </span>
                      </div>

                      {/* Image (Background style) */}
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

                    {/* Info */}
                    <div>
                      <h3 className="text-[13px] font-bold uppercase leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 underline decoration-gray-300 underline-offset-2 mb-2">
                        {item.brand}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[13px] font-medium ${
                            item.tag === "SALE"
                              ? "text-[#ef4628]"
                              : "text-black"
                          }`}
                        >
                          {item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {item.originalPrice}
                          </span>
                        )}
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

        {/* ========== Policy Modal ========== */}
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
            document.body
          )}
      </main>
    </>
  );
}

// --- 🔥 後端邏輯：SSG + ISR ---
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const WC_URL = process.env.WC_SITE_URL;
  const CK = process.env.WC_CONSUMER_KEY;
  const CS = process.env.WC_CONSUMER_SECRET;
  const slug = params.slug;

  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    // 1. 抓取主要商品
    const apiUrl = `${WC_URL}/wp-json/wc/v3/products?consumer_key=${CK}&consumer_secret=${CS}&slug=${encodeURIComponent(
      slug
    )}`;
    const res = await fetch(apiUrl, {
      agent,
      headers: { "User-Agent": "Mozilla/5.0..." },
    });

    if (!res.ok) throw new Error("Fetch failed");
    const products = await res.json();
    if (products.length === 0) return { notFound: true };

    const p = products[0];

    // 2. 🔥🔥 新增：抓取相關商品 (排除當前商品，抓最新 8 筆) 🔥🔥
    const relatedApiUrl = `${WC_URL}/wp-json/wc/v3/products?consumer_key=${CK}&consumer_secret=${CS}&exclude=${p.id}&per_page=8`;
    const relatedRes = await fetch(relatedApiUrl, {
      agent,
      headers: { "User-Agent": "Mozilla/5.0..." },
    });
    const relatedData = await relatedRes.json();

    // 格式化相關商品數據
    const formattedRelated = relatedData.map((item) => {
      // 抓品牌
      const brandAttr = item.attributes.find(
        (a) => a.name.toLowerCase() === "brand"
      );
      const brandName = brandAttr ? brandAttr.options[0] : "Ciéman Select";

      return {
        id: item.id,
        slug: item.slug, // 用於連結跳轉
        title: item.name.toUpperCase(),
        brand: brandName,
        price: `NT$ ${parseInt(item.price || 0).toLocaleString()}`,
        originalPrice:
          item.regular_price && item.sale_price
            ? `NT$ ${parseInt(item.regular_price).toLocaleString()}`
            : null,
        image: item.images.length > 0 ? item.images[0].src : null,
        // 標籤邏輯：有特價就顯示 SALE(紅)，否則 NEW(黑)
        tag: item.on_sale ? "SALE" : "NEW",
        tagColor: item.on_sale ? "red" : "black",
      };
    });

    // 格式化主要商品 (維持原本邏輯)
    const getAttr = (name) => {
      const attr = p.attributes.find(
        (a) => a.name.toLowerCase() === name.toLowerCase()
      );
      return attr ? attr.options[0] : null;
    };

    const conditionText = p.product_condition || "";

    const formattedProduct = {
      id: p.id,
      title: p.name.toUpperCase(),
      price: `NT$ ${parseInt(p.price || 0).toLocaleString()}`,
      brand: getAttr("Brand") || "Ciéman Select",
      description: p.description || "",
      intro: p.short_description || "", // 下方 Tab 用的簡短說明
      shortDesc: (p.short_description || "")
        .replace(/<[^>]+>/g, "")
        .slice(0, 150),
      images: p.images.length > 0 ? p.images.map((img) => img.src) : [],

      specs: {
        rank: getAttr("Rank") || "Rank S",
        conditionText: conditionText,
        material: getAttr("Material") || "N/A",
        hardware: getAttr("Hardware") || "N/A",
        inStoreView: p.stock_status === "instock",
      },
    };

    return {
      props: {
        product: formattedProduct,
        relatedProducts: formattedRelated, // 🔥 傳入推薦商品
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Product detail fetch error:", error);
    return { notFound: true };
  }
}
