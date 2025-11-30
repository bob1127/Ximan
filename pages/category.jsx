"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { motion, useScroll, useTransform } from "framer-motion";

// --- 1. 品牌館資料 (Brands) ---
const BRANDS = [
  { name: "Hermès", count: 12 },
  { name: "Chanel", count: 28 },
  { name: "Louis Vuitton", count: 15 },
  { name: "Dior", count: 8 },
  { name: "Gucci", count: 6 },
  { name: "Loewe", count: 5 },
  { name: "Goyard", count: 3 },
  { name: "Prada", count: 4 },
  { name: "Balenciaga", count: 2 },
  { name: "Saint Laurent", count: 7 },
  { name: "Celine", count: 9 },
  { name: "Others", count: 10 },
];

// --- 2. 商品類別資料 (Categories) ---
const CATEGORIES = [
  { label: "Handbags 包款", key: "Handbags" },
  { label: "SLG 小皮件", key: "SLG" },
  { label: "Silk 絲巾", key: "Silk" },
  { label: "Shoes 鞋履", key: "Shoes" },
  { label: "Accessories 飾品", key: "Accessories" },
  { label: "Others 配件", key: "Others" },
];

// --- 3. 快速連結 (Quick Links) ---
const QUICK_LINKS = ["最新現貨", "經典包款", "熱門小皮件", "全配頂級收藏"];

// --- 4. 原始精品資料 (Base Products) ---
const BASE_PRODUCTS = [
  {
    id: 1,
    title: "HERMÈS BIRKIN 25 TOGO",
    brand: "Hermès",
    category: "Handbags",
    price: "NT$ 880,000",
    tags: ["最新現貨", "全配"],
    status: "RANK S",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg",
  },
  {
    id: 2,
    title: "CHANEL CLASSIC FLAP MEDIUM",
    brand: "Chanel",
    category: "Handbags",
    price: "NT$ 320,000",
    tags: ["經典包款"],
    status: "RANK A",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_8.jpg",
  },
  {
    id: 3,
    title: "LOUIS VUITTON SPEEDY 20",
    brand: "Louis Vuitton",
    category: "Handbags",
    price: "NT$ 68,000",
    tags: ["熱門小皮件"],
    status: "RANK SA",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_8.jpg",
  },
  {
    id: 4,
    title: "DIOR LADY DIOR MINI",
    brand: "Dior",
    category: "Handbags",
    price: "NT$ 145,000",
    tags: ["經典包款"],
    status: "RANK AB",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_13.jpg",
  },
  {
    id: 5,
    title: "CELINE TRIOMPHE SHOULDER BAG",
    brand: "Celine",
    category: "Handbags",
    price: "NT$ 85,000",
    tags: ["最新現貨"],
    status: "RANK S",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_24.jpg",
  },
  {
    id: 6,
    title: "HERMÈS CONSTANCE 18",
    brand: "Hermès",
    category: "Handbags",
    price: "NT$ 450,000",
    tags: ["全配頂級收藏"],
    status: "RANK S",
    image: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_14.jpg",
  },
  {
    id: 7,
    title: "HERMÈS SILK SCARF 90",
    brand: "Hermès",
    category: "Silk",
    price: "NT$ 15,000",
    tags: ["全配頂級收藏"],
    status: "RANK SA",
    image: "/images/placeholder-hermes.jpg",
  },
  {
    id: 8,
    title: "CHANEL CARD HOLDER",
    brand: "Chanel",
    category: "SLG",
    price: "NT$ 25,000",
    tags: ["熱門小皮件", "最新現貨"],
    status: "RANK S",
    image: "/images/placeholder-chanel.jpg",
  },
];

const ALL_PRODUCTS = [...BASE_PRODUCTS, ...BASE_PRODUCTS, ...BASE_PRODUCTS].map(
  (item, index) => ({
    ...item,
    id: index + 100,
  })
);

// --- 🔥 商品卡片組件 (修改為 Link) ---
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
    // ✅ 這裡改成 Link 並且 href 指向 /product-inner
    <Link
      href="/product-inner"
      className="group border-b border-gray-400 md:border-r border-gray-400 last:border-r-0 relative flex flex-col bg-white"
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
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="bg-black/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-sm font-medium tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="text-[10px] font-bold text-gray-500 border border-gray-400 px-1.5 py-0.5 rounded bg-white/80">
            {product.status}
          </span>
        </div>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out"
          style={{
            backgroundImage: `url('${encodeURI(product.image)}')`,
            transform: isHovered ? "scale(2)" : "scale(1)",
            transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`,
          }}
        ></div>
        <div
          className={`absolute inset-0 bg-black/5 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          }`}
        ></div>
      </div>
      <div className="p-5 bg-white mt-auto flex flex-col gap-1">
        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">
          {product.brand}
        </div>
        <h2 className="text-[14px] font-medium text-gray-900 leading-snug tracking-wide group-hover:text-[#ef4628] transition-colors">
          {product.title}
        </h2>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-[15px] font-bold text-black tracking-wide">
            {product.price}
          </p>
          <span className="text-[10px] text-gray-400 underline decoration-gray-300 underline-offset-2">
            View Detail
          </span>
        </div>
      </div>
    </Link>
  );
};

// --- 🔥 FilterSidebar 組件 ---
const FilterSidebar = ({
  activeFilter,
  onFilterChange,
  isMobile = false,
  onCloseMobile,
}) => {
  const isActive = (type, value) => {
    return activeFilter.type === type && activeFilter.value === value
      ? "text-[#ef4628] font-bold"
      : "text-gray-600 hover:text-black";
  };

  const linkClass =
    "text-[13px] transition-colors block leading-tight cursor-pointer";

  return (
    <div
      className={`flex ${
        isMobile ? "flex-col p-6 space-y-8" : "flex-row gap-6 p-6 md:p-8"
      }`}
    >
      <div className={isMobile ? "" : "flex-1"}>
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Collections
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onFilterChange("all", null);
                if (isMobile) onCloseMobile();
              }}
              className={`text-[13px] border rounded px-3 py-1.5 transition-colors ${
                activeFilter.type === "all"
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-700 hover:border-black"
              }`}
            >
              All Items
            </button>
            {QUICK_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  onFilterChange("collection", link);
                  if (isMobile) onCloseMobile();
                }}
                className={`text-[13px] border rounded px-3 py-1.5 transition-colors ${
                  activeFilter.type === "collection" &&
                  activeFilter.value === link
                    ? "bg-[#ef4628] text-white border-[#ef4628]"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
        {isMobile && <div className="border-t border-gray-200 mb-8"></div>}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Categories
          </h3>
          <ul className="space-y-3">
            {CATEGORIES.map((cat) => (
              <li key={cat.key}>
                <button
                  onClick={() => {
                    onFilterChange("category", cat.key);
                    if (isMobile) onCloseMobile();
                  }}
                  className={`${linkClass} ${isActive("category", cat.key)}`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isMobile && <div className="border-t border-gray-200"></div>}
      <div className={isMobile ? "" : "flex-1"}>
        <h3 className="text-lg font-bold mb-4 text-gray-400 md:text-black md:text-lg text-xs md:font-bold font-bold uppercase tracking-widest md:tracking-normal md:normal-case">
          Brand
        </h3>
        <ul
          className={`${
            isMobile ? "grid grid-cols-2 gap-x-4 gap-y-3" : "space-y-2"
          }`}
        >
          {BRANDS.map((brand) => (
            <li key={brand.name}>
              <button
                onClick={() => {
                  onFilterChange("brand", brand.name);
                  if (isMobile) onCloseMobile();
                }}
                className={`flex justify-between items-center w-full text-left ${linkClass} ${isActive(
                  "brand",
                  brand.name
                )}`}
              >
                <span className="truncate mr-1 md:underline md:decoration-gray-300 md:underline-offset-4">
                  {brand.name}
                </span>
                <span className="text-[10px] opacity-60">({brand.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-widest mt-4 sticky bottom-0"
        >
          View Results
        </button>
      )}
    </div>
  );
};

// --- 🔥 CompanyLocation 組件 ---
const CompanyLocation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.4, 0]
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.15, 1, 1.15]
  );

  return (
    <section
      ref={ref}
      className="company-location relative border-t border-gray-400"
    >
      <div className="flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/2 relative overflow-hidden min-h-[400px] md:min-h-full">
          <motion.div
            className="absolute inset-0 bg-black z-10 pointer-events-none"
            style={{ opacity: overlayOpacity }}
          ></motion.div>
          <motion.div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_6.jpg')",
              scale: imageScale,
            }}
          ></motion.div>
        </div>
        <div className="w-full md:w-1/2 bg-white p-10 md:p-20 flex flex-col justify-center">
          <h2 className="text-[32px] font-normal uppercase tracking-wide mb-10">
            STORE INFO
          </h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Address
              </h4>
              <p className="text-[15px] font-medium leading-relaxed">
                台灣省台中市北區中清路一段 428 號
              </p>
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] underline decoration-gray-400 underline-offset-4 text-gray-600 hover:text-black mt-2 inline-block"
              >
                View on Google Maps
              </a>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Open Hours
              </h4>
              <p className="text-[15px] font-medium leading-relaxed">
                13:00 – 20:00 (週一至週六)
                <br />
                <span className="text-gray-500 text-[13px]">
                  [定休日: 週日]
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Contact
              </h4>
              <p className="text-[15px] font-medium leading-relaxed">
                TEL: 0938-535-870
              </p>
              <div className="flex items-center gap-6 mt-4">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider hover:text-[#ef4628] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider hover:text-[#06c755] transition-colors"
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
                  LINE
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="#"
              className="inline-block bg-black text-white text-[14px] font-bold uppercase tracking-widest py-4 px-10 hover:bg-[#ef4628] transition-colors duration-300"
            >
              到店前請提前預約
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 🔥 Main Component ---
export default function Category() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState({
    type: "all",
    value: null,
  });

  const handleFilterChange = (type, value) => {
    setActiveFilter({ type, value });
    if (typeof window !== "undefined" && window.innerWidth < 768) {
    } else {
      const productSection = document.querySelector(".products-content");
      if (productSection) productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeFilter.type === "all") return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter((product) => {
      if (activeFilter.type === "brand") {
        return product.brand === activeFilter.value;
      }
      if (activeFilter.type === "category") {
        return product.category === activeFilter.value;
      }
      if (activeFilter.type === "collection") {
        return product.tags && product.tags.includes(activeFilter.value);
      }
      return true;
    });
  }, [activeFilter]);

  return (
    <>
      <main className="py-20 bg-white text-black font-sans min-h-screen">
        {/* Title & SEO Section */}
        <section>
          <div className="title">
            <div className="py-6 px-6 md:px-10">
              <h1 className="text-[32px] md:text-[36px] font-normal tracking-wide uppercase">
                ONLINE STORE
              </h1>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                嚴選二手精品・買賣・寄賣・置換｜台中實體門市｜100% 正品保證
              </p>
            </div>
            <div className="border-t border-gray-400 py-3 bg-stone-50">
              <Marquee gradient={false} speed={40}>
                <div className="flex items-center">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="px-10 md:px-20 flex flex-row items-center gap-4"
                    >
                      <span className="bg-[#1c1c1c] text-white text-[10px] rounded-full py-1 px-3 font-bold tracking-widest">
                        NEWS
                      </span>
                      <p className="text-[13px] font-medium text-gray-800 tracking-wide">
                        喜曼精品保證所有商品皆經專業鑑定，僅販售 100% 正品。
                      </p>
                      <span className="text-gray-300">|</span>
                      <p className="text-[13px] font-medium text-[#ef4628] tracking-wide">
                        慶祝開幕，來電限時優惠特價，名額有限！
                      </p>
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        </section>

        {/* Mobile Filter */}
        <div className="md:hidden sticky top-[60px] z-40 bg-white border-t border-b border-gray-400 shadow-sm">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex justify-between items-center py-4 px-6 bg-white active:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
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
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              FILTER & CATEGORIES
              {activeFilter.type !== "all" && (
                <span className="ml-2 text-[#ef4628] text-xs">
                  ({activeFilter.value})
                </span>
              )}
            </span>
            <span
              className={`transform transition-transform duration-300 ${
                isMobileFilterOpen ? "rotate-180" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out bg-[#fdfdfd] ${
              isMobileFilterOpen
                ? "max-h-[85vh] border-t border-gray-200"
                : "max-h-0"
            }`}
          >
            <div className="overflow-y-auto max-h-[85vh]">
              <FilterSidebar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                isMobile={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="products-content border-t border-b border-gray-400 flex flex-col md:flex-row">
          <div className="filter hidden md:flex w-full md:w-[25%] border-b md:border-b-0 md:border-r border-gray-400 relative bg-white">
            <div className="sticky top-20 h-auto overflow-y-auto max-h-[calc(100vh-100px)] w-full">
              <FilterSidebar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                isMobile={false}
              />
            </div>
          </div>
          <div className="products w-full md:w-[75%] min-h-[50vh]">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg">No products found in this category.</p>
                <button
                  onClick={() => handleFilterChange("all", null)}
                  className="mt-4 underline hover:text-black"
                >
                  View All Products
                </button>
              </div>
            )}
            <div className="p-8 md:p-12 bg-stone-50 border-t border-gray-400">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                CIÉMAN 喜曼精品｜台中二手精品買賣、寄賣、置換
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-4xl">
                專營 Hermès、Chanel、LV、Dior、Gucci、Loewe
                等國際精品品牌。提供商品買賣，款式代尋、報價透明公開與優質售後服務。我們打造一樓至二樓的精品展示空間，以柔和的光線、乾淨俐落的動線與高質感材質堆疊，希望每位踏進店裡的貴賓，都能感受專屬於
                CIÉMAN 的優雅與誠意。
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-center py-8 md:py-12 border-b border-gray-400">
          <Link
            href="/all-items"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-black px-8 py-3 font-bold text-black transition-all duration-300 hover:text-white"
          >
            <span className="absolute inset-0 h-full w-full translate-y-full bg-black transition-all duration-300 group-hover:translate-y-0"></span>
            <span className="relative">VIEW MORE ITEMS</span>
          </Link>
        </div>

        {/* 🔥 新增的 CompanyLocation 組件 */}
        <CompanyLocation />
      </main>
    </>
  );
}
