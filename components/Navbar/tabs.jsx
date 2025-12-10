"use client";

import { useUser } from "../../components/context/UserContext";
import { useCart } from "../../components/context/CartContext";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, User, ShoppingBag } from "lucide-react";

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { totalQty, setIsCartOpen } = useCart();
  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);
  const { userInfo, logout, setUserInfo } = useUser();

  const userMenuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMega("none");
      }
    };
    document.addEventListener("mouseover", handleMouseLeave);
    return () => document.removeEventListener("mouseover", handleMouseLeave);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(
      "https://inf.fjg.mybluehost.me/website_19581d8b/wp-json/wp/v2/users/me",
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.code && typeof setUserInfo === "function") {
          setUserInfo(data);
        }
      })
      .catch((err) => console.error("無法取得使用者資訊", err));
  }, [setUserInfo]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resCategories, resBrand] = await Promise.all([
          fetch("/api/categories?slug=categories"),
          fetch("/api/categories?slug=brand"),
        ]);
        const cats = resCategories.ok ? await resCategories.json() : [];
        const brands = resBrand.ok ? await resBrand.json() : [];
        setCategoriesChildren(Array.isArray(cats) ? cats : []);
        setBrandChildren(Array.isArray(brands) ? brands : []);
      } catch (err) {
        console.error("取得 WooCommerce 分類失敗", err);
      }
    }
    fetchData();
  }, []);

  const navLinks = [
    {
      key: "categories",
      labelTop: "產品類別",
      labelBottom: "CATEGORIES",
      href: "/category",
    },
    {
      key: "brand",
      labelTop: "品牌館",
      labelBottom: "BRAND",
      href: "/category",
    },
    { key: "news", labelTop: "最新消息", labelBottom: "NEWS", href: "#" },
    { key: "SERVICE", labelTop: "服務流程", labelBottom: "SERVICE", href: "#" },
    { key: "NOTE", labelTop: "購物須知", labelBottom: "NOTE", href: "/charge" },
    {
      key: "CONTACT",
      labelTop: "聯繫喜曼",
      labelBottom: "CONTACT",
      href: "/charge",
    },
    {
      key: "ABOUT",
      labelTop: "公司介紹",
      labelBottom: "ABOUT",
      href: "/charge",
    },
  ];

  const megaVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <div ref={navRef} className="relative">
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[900] pointer-events-none md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-full h-full bg-black/20 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openMega !== "none" && (
          <motion.div
            className="fixed inset-0 top-[80px] z-[940] bg-black/20 backdrop-blur-sm hidden md:block"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={() => setOpenMega("none")}
          />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full z-[1000] bg-white/95 backdrop-blur-md border-b border-gray-100 transition-colors duration-300 bg-white">
        <div className="relative flex justify-between items-center px-5 md:px-[50px] py-4 md:py-0 md:h-[80px] max-w-[1920px] mx-auto">
          {/* 1. Left Area */}
          <div className="flex items-center w-[140px] flex-shrink-0">
            <button
              className="md:hidden text-black p-1 -ml-1 mr-2"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? (
                <X size={26} strokeWidth={1.5} />
              ) : (
                <Menu size={26} strokeWidth={1.5} />
              )}
            </button>

            <Link href="/" className="hidden md:block w-[60px]">
              <Image
                src="/images/logo/喜曼＿Logo＿給檔＿黑-02(1).png"
                alt="CIEMAN"
                width={120}
                height={40}
                priority
                className="w-full h-auto"
              />
            </Link>
          </div>

          {/* 2. Center: Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-center items-center h-full gap-1 lg:gap-4">
            {navLinks.map((link) => {
              const isMega = link.key === "categories" || link.key === "brand";

              return (
                <div
                  key={link.key}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => {
                    if (link.key === "categories") setOpenMega("categories");
                    if (link.key === "brand") setOpenMega("brand");
                  }}
                >
                  <Link
                    href={link.href}
                    className="group relative h-10 rounded-full bg-transparent px-3 lg:px-5 text-neutral-950 flex items-center justify-center"
                  >
                    <span className="relative inline-grid grid-cols-1 overflow-hidden leading-[2.5rem] text-[13px] font-bold text-center whitespace-nowrap">
                      <div className="col-start-1 row-start-1 transition duration-500 group-hover:-translate-y-full group-hover:skew-y-12 tracking-widest text-gray-400">
                        {link.labelBottom}
                      </div>
                      <div className="col-start-1 row-start-1 translate-y-full group-hover:translate-y-0 group-hover:skew-y-0 transition duration-500 text-black tracking-widest">
                        {link.labelTop}
                      </div>
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Mobile Logo */}
          <Link
            href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-widest text-black uppercase"
          >
            CIÉMAN
          </Link>

          {/* 3. Right: Icons */}
          <div className="flex items-center justify-end w-[140px] flex-shrink-0 gap-3 md:gap-5">
            <Link
              href="/wishlist"
              className="text-black hover:text-gray-600 transition-colors"
            >
              <Heart size={24} strokeWidth={1.5} />
            </Link>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-black hover:text-gray-600 transition-colors flex items-center pt-1"
              >
                <User size={24} strokeWidth={1.5} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-full mt-4 w-48 bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden z-[1100]"
                  >
                    <div className="py-2">
                      {userInfo ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-500">歡迎回來</p>
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {userInfo.name}
                            </p>
                          </div>
                          <Link
                            href="/member/profile"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            會員資料
                          </Link>
                          <Link
                            href="/member/orders"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            訂單查詢
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                          >
                            登出
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            會員登入
                          </Link>
                          <Link
                            href="/register"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            註冊帳號
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-black hover:text-gray-600 transition-colors relative flex items-center pt-1"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ef4628] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {openMega !== "none" && (
            <motion.div
              key="mega-menu"
              variants={megaVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 right-0 top-[80px] z-[950] bg-white shadow-xl border-t border-gray-100 hidden md:block"
              onMouseEnter={() => setOpenMega(openMega)}
            >
              <div className="max-w-[1440px] mx-auto px-8 py-12">
                <div className="mb-8 flex items-baseline justify-between border-b border-gray-100 pb-4">
                  <div className="text-sm tracking-[0.2em] text-gray-400 font-bold">
                    {openMega === "categories" ? "CATEGORIES" : "BRAND"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {openMega === "categories" ? "產品類別" : "品牌館"}
                  </div>
                </div>

                {/* --- 修改開始：針對 Brand 進行特殊排版 --- */}
                {openMega === "brand" ? (
                  (() => {
                    // ✅ 1. 改為物件陣列，包含名稱與對應連結
                    const featuredBrandsData = [
                      { name: "Hermès", href: "/category/Hermes" },
                      { name: "Chanel", href: "/category/Chanel" },
                      { name: "Louis Vuitton", href: "/category/LouisVuitton" },
                      { name: "Dior", href: "/category/Dior" },
                    ];

                    // 2. 篩選資料 (同時找出對應的 API 資料與連結)
                    const featuredBrands = brandChildren
                      .filter((cat) =>
                        featuredBrandsData.some((f) =>
                          cat.name.toLowerCase().includes(f.name.toLowerCase())
                        )
                      )
                      .map((cat) => {
                        // 找到對應的連結
                        const linkData = featuredBrandsData.find((f) =>
                          cat.name.toLowerCase().includes(f.name.toLowerCase())
                        );
                        return { ...cat, customHref: linkData?.href };
                      });

                    const otherBrands = brandChildren.filter(
                      (cat) =>
                        !featuredBrandsData.some((f) =>
                          cat.name.toLowerCase().includes(f.name.toLowerCase())
                        )
                    );

                    // 3. 共用的渲染 Item 函式
                    const renderItem = (cat, isFeatured = false) => (
                      <Link
                        key={cat.id}
                        // ✅ 使用自定義連結，若無則回退預設
                        href={cat.customHref || "/category"}
                        className="group/item flex flex-col gap-3 text-center"
                        onClick={() => setOpenMega("none")}
                      >
                        {cat.image && cat.image.src && (
                          <div
                            className={`overflow-hidden rounded-full relative aspect-square bg-gray-50 mb-2 border border-gray-100 group-hover/item:border-black transition-colors ${
                              isFeatured ? "w-full" : ""
                            }`}
                          >
                            <Image
                              src={cat.image.src}
                              alt={cat.name}
                              fill
                              className="object-cover transform group-hover/item:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <span
                          className={`font-bold tracking-wide text-gray-800 group-hover/item:text-black transition-colors uppercase ${
                            isFeatured ? "text-base" : "text-sm"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </Link>
                    );

                    return (
                      <div className="flex flex-col gap-10">
                        {/* A. 置頂品牌區 */}
                        {featuredBrands.length > 0 && (
                          <div className="grid grid-cols-4 gap-12 px-20">
                            {featuredBrands.map((cat) => renderItem(cat, true))}
                          </div>
                        )}

                        {/* 分隔線 */}
                        {featuredBrands.length > 0 &&
                          otherBrands.length > 0 && (
                            <div className="w-full h-[1px] bg-gray-100" />
                          )}

                        {/* B. 其他品牌區 */}
                        <div className="grid grid-cols-6 gap-8">
                          {otherBrands.map((cat) => renderItem(cat, false))}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* Categories 邏輯維持不變 */
                  <div className="grid grid-cols-6 gap-8">
                    {categoriesChildren.map((cat) => (
                      <Link
                        key={cat.id}
                        href="/category"
                        className="group/item flex flex-col gap-3 text-center"
                        onClick={() => setOpenMega("none")}
                      >
                        {cat.image && cat.image.src && (
                          <div className="overflow-hidden rounded-full relative aspect-square bg-gray-50 mb-2 border border-gray-100 group-hover/item:border-black transition-colors">
                            <Image
                              src={cat.image.src}
                              alt={cat.name}
                              fill
                              className="object-cover transform group-hover/item:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <span className="text-sm font-bold tracking-wide text-gray-800 group-hover/item:text-black transition-colors uppercase">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className="md:hidden fixed top-[60px] left-0 right-0 z-[950] bg-[#fdfdfd] text-[#1b1b1b] shadow-2xl overflow-hidden max-h-[calc(100vh-60px)] flex flex-col border-t border-gray-100"
          >
            <div className="overflow-y-auto p-6 pb-20">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <div key={link.key}>
                    <Link
                      href={link.href}
                      className="flex items-baseline justify-between group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="text-lg font-bold text-[#1b1b1b] uppercase tracking-wide">
                        {link.labelTop}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium tracking-widest">
                        {link.labelBottom}
                      </div>
                    </Link>

                    {link.key === "categories" &&
                      categoriesChildren.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {categoriesChildren.map((cat) => (
                            <Link
                              key={cat.id}
                              href="/category"
                              onClick={() => setIsMenuOpen(false)}
                              className="text-xs text-gray-600 bg-gray-50 py-2 px-3 rounded text-center hover:bg-black hover:text-white transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}

                    {link.key === "brand" && brandChildren.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {/* 手機版也需要對應的連結邏輯，這裡我們可以簡單處理，或者也套用上面的邏輯 */}
                        {brandChildren.map((cat) => {
                          // 簡單對應：如果有符合的就用，沒有就預設
                          const featuredBrandsData = [
                            { name: "Hermès", href: "/category/Hermes" },
                            { name: "Chanel", href: "/category/Chanel" },
                            {
                              name: "Louis Vuitton",
                              href: "/category/LouisVuitton",
                            },
                            { name: "Dior", href: "/category/Dior" },
                          ];
                          const linkData = featuredBrandsData.find((f) =>
                            cat.name
                              .toLowerCase()
                              .includes(f.name.toLowerCase())
                          );
                          const href = linkData ? linkData.href : "/category";

                          return (
                            <Link
                              key={cat.id}
                              href={href}
                              onClick={() => setIsMenuOpen(false)}
                              className="text-xs text-gray-600 bg-gray-50 py-2 px-3 rounded text-center hover:bg-black hover:text-white transition-colors"
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    <div className="w-full h-[1px] bg-gray-100 mt-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlideTabsExample;
