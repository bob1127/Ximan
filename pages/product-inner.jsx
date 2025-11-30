"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/context/CartContext"; // ✅ 1. 引入 Cart Context

// --- 模擬資料 ---
const PRODUCT = {
  id: 1,
  brand: "HERMÈS",
  title: "BIRKIN 25 TOGO LEATHER",
  price: "NT$ 880,000",
  description:
    "這款 Hermès Birkin 25 展現了極致的工藝與奢華。選用頂級 Togo 小牛皮，觸感柔軟且耐磨，是愛馬仕最受歡迎的皮革之一。經典的金色五金配件為整體增添了一抹高貴的光澤。包身結構挺拔，內部空間足以容納日常必需品。無論是正式場合還是休閒搭配，都能完美襯托您的氣質。此商品經過我們專業鑑定師的嚴格把關，保證 100% 正品，並附有完整的原廠配件。",
  images: [
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg",
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_8.jpg",
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_8.jpg",
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_14.jpg",
  ],
  specs: {
    rank: "Rank S",
    accessories: "全配 (盒、塵袋、購證、雨衣、說明書)",
    size: "25 x 20 x 13 cm (提把高 6cm)",
    year_stamp: "2023 / B刻",
    material: "Togo 小牛皮",
    hardware: "金釦 (五金光亮無磨損)",
    defects: "無明顯瑕疵，四角完好",
    inStoreView: true,
  },
};

const RECOMMEND_ITEMS = [
  {
    id: 101,
    title: "OKA SURFER PARKA (KHAKI)",
    brand: "Laid.B",
    price: "¥42,900",
    tag: "NEW",
    tagColor: "black",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg",
  },
  {
    id: 102,
    title: "LIFESAVING VEST (BLUE)",
    brand: "Laid.B",
    price: "¥18,810",
    originalPrice: "¥62,700",
    tag: "SALE",
    tagColor: "red",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_8.jpg",
  },
  {
    id: 103,
    title: "DUSTI JACKET (REF)",
    brand: "ryaw",
    price: "¥52,800",
    tag: "NEW",
    tagColor: "black",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_8.jpg",
  },
  {
    id: 104,
    title: "ALPHA CARDIGAN (BLACK)",
    brand: "ES:S",
    price: "¥24,200",
    tag: "NEW",
    tagColor: "black",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_14.jpg",
  },
];

// ✅ 新增：成功加入購物車的 Toast 組件
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

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showToast, setShowToast] = useState(false); // ✅ 控制 Toast

  const { addToCart } = useCart(); // ✅ 取得 addToCart 方法

  const [mounted, setMounted] = useState(false);
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

  const handleQtyChange = (type) => {
    if (type === "minus" && quantity > 1) setQuantity(quantity - 1);
    if (type === "plus") setQuantity(quantity + 1);
  };

  // ✅ 新增：處理購買按鈕點擊
  const handleBuy = () => {
    addToCart(PRODUCT, quantity); // 加入購物車

    // 顯示成功 Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
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
              HANDBAGS
            </Link>
            <span>/</span>
            <Link href="#" className="hover:text-black transition-colors">
              {PRODUCT.brand}
            </Link>
            <span>/</span>
            <span className="text-black border-b border-black">
              {PRODUCT.title}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
            {/* Left: Images */}
            <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col gap-1 md:gap-4">
              {PRODUCT.images.map((img, index) => (
                <div key={index} className="w-full relative">
                  <Image
                    src={img}
                    alt={`${PRODUCT.title} - ${index + 1}`}
                    width={1200}
                    height={1500}
                    className="w-full h-auto object-cover block"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Right: Info (Sticky) */}
            <div className="w-full md:w-[40%] lg:w-[35%]">
              <div className="sticky top-32">
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href="#"
                      className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
                    >
                      {PRODUCT.brand}
                    </Link>
                    <span className="bg-black text-white text-[10px] px-2 py-1 font-bold tracking-widest">
                      {PRODUCT.specs.rank}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-medium uppercase leading-tight mb-4 text-gray-900">
                    {PRODUCT.title}
                  </h1>
                  <p className="text-xl font-bold tracking-wide text-black">
                    {PRODUCT.price}
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

                    {/* ✅ 修改：綁定 handleBuy 事件 */}
                    <button
                      onClick={handleBuy}
                      className="flex-1 bg-[#ef4628] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#d63a1f] transition-all duration-300 shadow-md active:scale-95"
                    >
                      立即購買
                    </button>
                  </div>
                  <a
                    href="#"
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
                  <div
                    className={`text-[13px] text-gray-600 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${
                      isDescExpanded ? "max-h-[500px]" : "max-h-[60px]"
                    }`}
                  >
                    {PRODUCT.description}
                  </div>
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

                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                    className="flex justify-between items-center w-full text-sm font-bold uppercase tracking-widest mb-4 hover:text-[#ef4628]"
                  >
                    Details & Specs
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
                        <div className="bg-[#f9f9f9] p-5 space-y-3 text-[13px] border border-gray-100 mb-2">
                          <InfoRow
                            label="Accessory"
                            value={PRODUCT.specs.accessories}
                          />
                          <InfoRow label="Size" value={PRODUCT.specs.size} />
                          <InfoRow
                            label="Year/Stamp"
                            value={PRODUCT.specs.year_stamp}
                          />
                          <InfoRow
                            label="Material"
                            value={PRODUCT.specs.material}
                          />
                          <InfoRow
                            label="Hardware"
                            value={PRODUCT.specs.hardware}
                          />
                          <InfoRow
                            label="Defects"
                            value={PRODUCT.specs.defects}
                          />
                          <div className="pt-2 mt-2 border-t border-gray-200">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-gray-900 w-[40%]">
                                In-Store
                              </span>
                              <span
                                className={`w-[60%] font-medium ${
                                  PRODUCT.specs.inStoreView
                                    ? "text-[#06c755]"
                                    : "text-gray-400"
                                }`}
                              >
                                {PRODUCT.specs.inStoreView
                                  ? "● 可預約現場鑑賞"
                                  : "○ 僅限線上諮詢"}
                              </span>
                            </div>
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

        {/* ========== ✅ 2. Tabs 產品內文切換區塊 (加回來了) ========== */}
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
                  <Image
                    src="/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg"
                    alt="Product Banner"
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                  <h3 className="relative z-10 text-white text-3xl font-light tracking-widest uppercase">
                    Classic Elegance
                  </h3>
                </div>
                <div className="prose prose-stone mx-auto text-center max-w-2xl">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-wide">
                    關於 {PRODUCT.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                    這款 Hermès Birkin 25 展現了極致的工藝與奢華。選用頂級 Togo
                    小牛皮，觸感柔軟且耐磨，是愛馬仕最受歡迎的皮革之一。
                    經典的金色五金配件為整體增添了一抹高貴的光澤。
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    包身結構挺拔，內部空間足以容納日常必需品。無論是正式場合還是休閒搭配，都能完美襯托您的氣質。
                    此商品經過我們專業鑑定師的嚴格把關，保證 100%
                    正品，並附有完整的原廠配件。
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 p-6">
                      <h4 className="font-bold text-sm mb-2">Togo Leather</h4>
                      <p className="text-xs text-gray-500">
                        顆粒感適中，防刮耐用，且不易變形。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                      <h4 className="font-bold text-sm mb-2">Gold Hardware</h4>
                      <p className="text-xs text-gray-500">
                        經典貴氣金釦，狀況優良無氧化。
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
                  <div>
                    <h4 className="text-sm font-bold border-l-4 border-black pl-3 mb-3 uppercase">
                      運送方式
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      確認款項後，我們將於 24-48
                      小時內透過高價保值快遞寄出，或可預約至台中門市自取。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== Recommend Items ========== */}
        <section className="others-products max-w-[1440px] mx-auto px-6 md:px-10 border-t border-gray-200 pt-16">
          <h2 className="text-2xl md:text-[28px] font-normal uppercase tracking-wide mb-10">
            Recommend Items
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {RECOMMEND_ITEMS.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative w-full aspect-[4/5] bg-[#f4f4f4] mb-4 overflow-hidden">
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.tagColor === "red" ? "bg-[#ef4628]" : "bg-black"
                      }`}
                    ></span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-800">
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10 text-[9px] text-gray-400 font-medium">
                    25AW
                  </div>
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${encodeURI(item.image)}')`,
                    }}
                  ></div>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold uppercase leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 underline decoration-gray-300 underline-offset-2 mb-2">
                    {item.brand}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[13px] font-medium ${
                        item.tag === "SALE" ? "text-[#ef4628]" : "text-black"
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
              </div>
            ))}
          </div>
        </section>

        {/* ========== Policy Modal (使用 createPortal) ========== */}
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
                          <li>
                            我們提供 100% 正品保證，若驗出贗品將全額退款。
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-black mb-3 uppercase tracking-wide border-l-4 border-black pl-3">
                          退換貨政策
                        </h4>
                        <p className="mb-2">
                          由於精品買賣的特殊性，
                          <strong>
                            售出後除真偽問題外，恕不接受任何理由（如不喜歡、尺寸不合等）退換貨。
                          </strong>
                        </p>
                        <p>
                          建議您購買前透過 LINE
                          官方帳號索取更多細節照片或預約現場看包。
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-black mb-3 uppercase tracking-wide border-l-4 border-black pl-3">
                          運送與付款
                        </h4>
                        <p>
                          確認款項後，我們將於 24-48
                          小時內透過高價保值快遞寄出。付款方式支援：信用卡、銀行轉帳、LINE
                          Pay。
                        </p>
                      </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                      <button
                        onClick={() => setIsPolicyModalOpen(false)}
                        className="bg-black text-white px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors"
                      >
                        I Understand
                      </button>
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

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="font-bold text-gray-900 w-[40%] uppercase tracking-tight">
      {label}
    </span>
    <span className="w-[60%] text-gray-600 leading-snug">{value}</span>
  </div>
);
