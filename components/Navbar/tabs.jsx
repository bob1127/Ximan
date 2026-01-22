"use client";

import { useUser } from "../../components/context/UserContext";
import { useCart } from "../../components/context/CartContext";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShoppingBag, Search } from "lucide-react"; // 新增 Search icon

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 滾動狀態 (僅用於邊框陰影顯示，不再用於縮放 Logo)
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalQty, setIsCartOpen } = useCart();
  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);
  const { userInfo, logout, setUserInfo } = useUser();

  const userMenuRef = useRef(null);
  const navRef = useRef(null);

  // 監聽滾動事件 (保留陰影效果邏輯)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Fetch User Info
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

  // Fetch Categories
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
    { key: "categories", label: "產品類別", href: "/category" },
    { key: "brand", label: "品牌館", href: "/category" },
    { key: "news", label: "最新消息", href: "#" },
    { key: "SERVICE", label: "服務流程", href: "/service" },
    { key: "NOTE", label: "購物須知", href: "/note" },
    { key: "CONTACT", label: "聯繫凱仕", href: "/contact" },
    { key: "ABOUT", label: "公司介紹", href: "/about" },
  ];

  const megaVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div ref={navRef} className="relative font-sans text-gray-800">
      {/* Mobile Menu Backdrop */}
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

      {/* Desktop Mega Menu Backdrop */}
      <AnimatePresence>
        {openMega !== "none" && (
          <motion.div
            // Mega menu top position adjusted for taller header
            className="fixed inset-0 top-[140px] z-[940] bg-black/20 backdrop-blur-sm hidden md:block"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={() => setOpenMega("none")}
          />
        )}
      </AnimatePresence>

      {/* Main Header Container */}
      <div
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 bg-[#fcf8f3] ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        {/* =========================================================
            ROW 1: Tools (Search) | Logo | Tools (Account/Cart) 
            (Desktop Visible, Mobile Adjusted)
           ========================================================= */}
        <div className="relative flex justify-between items-center px-4 md:px-10 py-4 max-w-[1920px] mx-auto">
          {/* Left: Mobile Hamburger / Desktop Search */}
          <div className="flex items-center w-[200px] flex-shrink-0">
            {/* Mobile Menu Button */}
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

            {/* Desktop Search (仿圖樣式) */}
            <div className="hidden md:flex items-center group cursor-pointer">
              <Search size={20} strokeWidth={1.5} className="text-gray-800" />
              <div className="ml-3 relative py-1 border-b border-gray-800 w-[120px] lg:w-[180px]">
                <span className="text-sm font-bold text-gray-600">搜尋</span>
              </div>
            </div>
          </div>

          {/* Center: Logo (Fixed Size, No scroll animation) */}
          <div className="flex-1 flex justify-center items-center">
            {/* <Link href="/" className="relative block w-[65px] md:w-[80px]">
             
              <Image
                src="/images/logo/喜曼＿Logo＿給檔＿黑-02(1).png"
                alt="CIEMAN"
                width={160}
                height={60}
                priority
                className="w-full h-auto object-contain"
              />
            </Link> */}
          </div>

          {/* Right: Account & Cart (with Labels) */}
          <div className="flex items-center justify-end w-[200px] flex-shrink-0 gap-6">
            {/* User Account */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-800 hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                <User size={22} strokeWidth={1.5} />
                <span className="text-xs font-bold tracking-wide">
                  會員帳戶
                </span>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
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
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            會員資料
                          </Link>
                          <Link
                            href="/member/orders"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            訂單查詢
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                          >
                            登出
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            會員登入
                          </Link>
                          <Link
                            href="/register"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
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

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-800 hover:opacity-70 transition-opacity relative flex items-center gap-2"
            >
              <div className="relative">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {totalQty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ef4628] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalQty}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-wide hidden md:block">
                購物車
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================
            ROW 2: Navigation Links (Desktop Only)
           ========================================================= */}
        <div className="hidden md:flex justify-center pb-4 pt-1">
          <div className="flex gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <div
                key={link.key}
                className="relative"
                onMouseEnter={() => {
                  if (link.key === "categories") setOpenMega("categories");
                  else if (link.key === "brand") setOpenMega("brand");
                  else setOpenMega("none");
                }}
              >
                <Link
                  href={link.href}
                  className="text-[13px] font-bold tracking-[0.1em] text-gray-800 hover:text-gray-500 transition-colors uppercase py-2"
                >
                  {link.label}
                </Link>
                {/* Active/Hover Indicator Line (Optional style) */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-800 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            Mega Menu Dropdown (Position adjusted for 2-row header)
           ========================================================= */}
        <AnimatePresence>
          {openMega !== "none" && (
            <motion.div
              key="mega-menu"
              variants={megaVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              // Adjusted top position to sit below the 2nd row
              className="absolute left-0 right-0 top-full z-[950] bg-[#fcf8f3] border-t border-gray-200 shadow-xl hidden md:block"
              onMouseEnter={() => setOpenMega(openMega)}
              onMouseLeave={() => setOpenMega("none")}
            >
              <div className="max-w-[1440px] mx-auto px-8 py-12">
                {/* Header of Mega Menu */}
                <div className="mb-8 flex items-baseline justify-between border-b border-gray-200 pb-4">
                  <div className="text-sm tracking-[0.2em] text-gray-500 font-bold uppercase">
                    {openMega === "categories" ? "Categories" : "Brand"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {openMega === "categories" ? "產品類別" : "品牌館"}
                  </div>
                </div>

                {/* Content Logic (Same as before) */}
                {openMega === "brand" ? (
                  // ... (Brand logic kept exactly the same) ...
                  (() => {
                    const featuredBrandsData = [
                      { name: "Hermès", href: "/category/Hermes" },
                      { name: "Chanel", href: "/category/Chanel" },
                      { name: "Louis Vuitton", href: "/category/LouisVuitton" },
                      { name: "Dior", href: "/category/Dior" },
                    ];
                    const featuredBrands = brandChildren
                      .filter((cat) =>
                        featuredBrandsData.some((f) =>
                          cat.name.toLowerCase().includes(f.name.toLowerCase())
                        )
                      )
                      .map((cat) => {
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

                    const renderItem = (cat, isFeatured = false) => (
                      <Link
                        key={cat.id}
                        href={cat.customHref || "/category"}
                        className="group/item flex flex-col gap-3 text-center"
                        onClick={() => setOpenMega("none")}
                      >
                        {cat.image && cat.image.src && (
                          <div
                            className={`overflow-hidden rounded-full relative aspect-square bg-white mb-2 border border-gray-100 group-hover/item:border-gray-400 transition-colors ${
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
                        {featuredBrands.length > 0 && (
                          <div className="grid grid-cols-4 gap-12 px-20">
                            {featuredBrands.map((cat) => renderItem(cat, true))}
                          </div>
                        )}
                        {featuredBrands.length > 0 &&
                          otherBrands.length > 0 && (
                            <div className="w-full h-[1px] bg-gray-200" />
                          )}
                        <div className="grid grid-cols-6 gap-8">
                          {otherBrands.map((cat) => renderItem(cat, false))}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  // Category Logic
                  <div className="grid grid-cols-6 gap-8">
                    {categoriesChildren.map((cat) => (
                      <Link
                        key={cat.id}
                        href="/category"
                        className="group/item flex flex-col gap-3 text-center"
                        onClick={() => setOpenMega("none")}
                      >
                        {cat.image && cat.image.src && (
                          <div className="overflow-hidden rounded-full relative aspect-square bg-white mb-2 border border-gray-100 group-hover/item:border-gray-400 transition-colors">
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

      {/* Mobile Menu (Sidebar) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-[60px] left-0 right-0 bottom-0 z-[950] bg-[#fcf8f3] text-gray-900 shadow-2xl overflow-y-auto"
          >
            {/* Mobile Menu Content ... (Adjusted slightly for styling consistency) */}
            <div className="p-6 pb-20">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 text-gray-600 mb-4">
                  <Search size={20} />
                  <span className="text-sm">搜尋</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="flex items-baseline justify-between group py-2 border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="text-lg font-bold uppercase tracking-wide">
                      {link.label}
                    </div>
                  </Link>
                ))}

                {/* Mobile User Links */}
                <div className="mt-4 pt-6 border-t border-gray-300">
                  <Link
                    href={userInfo ? "/member/profile" : "/login"}
                    className="flex items-center gap-3 py-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    <span className="text-sm font-bold">
                      {userInfo ? "會員中心" : "登入 / 註冊"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlideTabsExample;
