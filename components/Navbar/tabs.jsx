"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  ShoppingBag,
  Search,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";
import { useCart } from "../../components/context/CartContext";
import { useTranslation } from "next-i18next";

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // 🔥 即時搜尋相關 State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState({
    products: [],
    pages: [],
  });
  const searchContainerRef = useRef(null);

  const { data: session, status } = useSession();
  const { totalQty, setIsCartOpen } = useCart();

  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const navRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation("common");

  // --- 滾動偵測 ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 點擊外部關閉選單 ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMega("none");
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mouseover", (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        !searchContainerRef.current?.contains(e.target)
      ) {
        setOpenMega("none");
      }
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- 抓取 Mega Menu 資料 ---
  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true);
        const wpLang = router.locale === "zh-TW" ? "zh" : router.locale;
        const res = await fetch(`/api/categories?lang=${wpLang}`);
        const allCats = res.ok ? await res.json() : [];

        const brandParent = allCats.find(
          (c) => c.slug.includes("brand") || c.slug.includes("브랜드"),
        );
        const typeParent = allCats.find(
          (c) => c.slug.includes("categories") || c.slug.includes("카테고리"),
        );

        setBrandChildren(
          brandParent ? allCats.filter((c) => c.parent === brandParent.id) : [],
        );
        setCategoriesChildren(
          typeParent ? allCats.filter((c) => c.parent === typeParent.id) : [],
        );
      } catch (error) {
        console.error("選單資料載入失敗:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuData();
  }, [router.locale]);

  // --- 防抖即時搜尋邏輯 ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowSearchDropdown(true);

        const query = searchQuery.toLowerCase();

        const staticPages = [
          {
            title: t("navbar.about") || "公司介紹",
            url: "/about",
            type: "Page",
          },
          {
            title: t("navbar.contact") || "聯繫凱仕",
            url: "/contact",
            type: "Page",
          },
          { title: t("navbar.faq") || "常見問題", url: "/faq", type: "Page" },
          { title: t("navbar.news") || "最新消息", url: "/news", type: "Page" },
          {
            title: t("navbar.service") || "服務流程",
            url: "/service",
            type: "Page",
          },
          {
            title: t("navbar.shipping") || "全球配送",
            url: "/shipping",
            type: "Page",
          },
          {
            title: t("navbar.authenticity") || "正品保證",
            url: "/authenticity",
            type: "Page",
          },
        ].filter((p) => p.title.toLowerCase().includes(query));

        try {
          const wpLang = router.locale === "zh-TW" ? "zh" : router.locale;
          const res = await fetch(
            `/api/search-products?q=${encodeURIComponent(searchQuery)}&lang=${wpLang}`,
          );
          const products = res.ok ? await res.json() : [];
          setSearchResults({ pages: staticPages, products });
        } catch (err) {
          console.error(err);
          setSearchResults({ pages: staticPages, products: [] });
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ products: [], pages: [] });
        setShowSearchDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router.locale, t]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearchDropdown(false);
        setIsMenuOpen(false);
        setSearchQuery("");
      }
    }
  };

  const changeLanguage = (newLocale) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(router.pathname, router.asPath, { locale: newLocale });
    setIsLangOpen(false);
  };

  const navLinks = [
    {
      key: "categories",
      label: t("navbar.categories") || "產品類別",
      href: "/category",
      hasMega: true,
    },
    {
      key: "brand",
      label: t("navbar.brand") || "品牌館",
      href: "/category",
      hasMega: true,
    },
    {
      key: "AUTHENTICITY",
      label: t("navbar.authenticity") || "正品保證",
      href: "/authenticity",
    },
    {
      key: "SHIPPING",
      label: t("navbar.shipping") || "全球配送",
      href: "/shipping",
    },
    {
      key: "SERVICE",
      label: t("navbar.service") || "服務流程",
      href: "/service",
    },
    { key: "news", label: t("navbar.news") || "最新消息", href: "/news" },
    { key: "FAQ", label: t("navbar.faq") || "常見問題", href: "/faq" },
    {
      key: "CONTACT",
      label: t("navbar.contact") || "聯繫凱仕",
      href: "/contact",
    },
    { key: "ABOUT", label: t("navbar.about") || "公司介紹", href: "/about" },
  ];

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: navLinks.map((link) => link.label),
    url: navLinks.map((link) => `https://www.kesh-de1.com${link.href}`),
  };

  const megaVariants = {
    hidden: { opacity: 0, y: -10, display: "none" },
    visible: {
      opacity: 1,
      y: 0,
      display: "block",
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
      transitionEnd: { display: "none" },
    },
  };

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationSchema),
          }}
        />
      </Head>

      <div
        ref={navRef}
        className={`font-sans text-gray-800 z-[1000] w-full transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 shadow-md" : "relative"
        }`}
      >
        {/* Desktop Top Bar */}
        <div className="bg-[#ef4628] text-white text-[11px] md:text-xs font-medium py-2 px-4 transition-all duration-300">
          <div className="max-w-[1920px] mx-auto flex justify-between items-center px-4">
            <div className="flex gap-4">
              <a
                href="tel:+886901055624"
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Phone size={14} /> +886 912-345-678
              </a>
              <a
                href="mailto:contact@kesh-de1.com"
                className="hidden sm:flex items-center gap-2 hover:opacity-80"
              >
                <Mail size={14} /> contact@kesh-de1.com
              </a>
            </div>
            <div className="flex gap-4 divide-x divide-white/30">
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <Globe size={14} />
                  <span>{t(`lang.${router.locale}`) || "繁體中文"}</span>
                  <ChevronRight
                    size={12}
                    className={`transition-transform ${isLangOpen ? "rotate-90" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-[120%] right-0 mt-2 w-32 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden z-[1100]"
                    >
                      <div className="flex flex-col text-gray-700 text-xs text-left">
                        <button
                          onClick={() => changeLanguage("zh-TW")}
                          className="px-4 py-3 text-left hover:bg-gray-50 hover:text-[#ef4628] transition-colors w-full border-b border-gray-50"
                        >
                          繁體中文
                        </button>
                        <button
                          onClick={() => changeLanguage("en")}
                          className="px-4 py-3 text-left hover:bg-gray-50 hover:text-[#ef4628] transition-colors w-full border-b border-gray-50"
                        >
                          English
                        </button>
                        <button
                          onClick={() => changeLanguage("ko")}
                          className="px-4 py-3 text-left hover:bg-gray-50 hover:text-[#ef4628] transition-colors w-full"
                        >
                          한국어
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden md:flex pl-4 gap-3">
                {status === "authenticated" && session ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/member"
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      {session.user.image && (
                        <img
                          src={session.user.image}
                          alt="avatar"
                          className="w-5 h-5 rounded-full border border-white/50 object-cover"
                        />
                      )}
                      <span>Hi, {session.user.name}</span>
                    </Link>
                    <span className="text-white/40">|</span>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="hover:text-gray-200 flex items-center gap-1"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="hover:opacity-80">
                      Login
                    </Link>
                    <Link href="/register" className="hover:opacity-80">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`bg-white border-b border-gray-100 w-full transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}
        >
          <div className="max-w-[1920px] mx-auto px-6 md:px-10 flex justify-between items-center">
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2">
                <Menu size={24} />
              </button>
            </div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-widest absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
            >
              KÉSH<span className="text-[#ef4628]">.</span>
            </Link>
            <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
              {navLinks.map((link) => (
                <div
                  key={link.key}
                  className="relative group py-2 cursor-pointer"
                  onMouseEnter={() => {
                    if (link.hasMega) setOpenMega(link.key);
                    else setOpenMega("none");
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-[13px] font-bold tracking-widest hover:text-[#ef4628] uppercase transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ef4628] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </div>
              ))}
            </nav>

            {/* Desktop Search & Cart */}
            <div className="flex items-center gap-4">
              <div
                className="hidden lg:block relative"
                ref={searchContainerRef}
              >
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full transition-all border border-transparent focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    onFocus={() => {
                      if (searchQuery.trim().length > 1)
                        setShowSearchDropdown(true);
                    }}
                    placeholder={t("navbar.search") || "Search..."}
                    className="bg-transparent text-sm w-40 outline-none border-none focus:ring-0 p-0 placeholder:text-gray-400 text-gray-800"
                  />
                  <button
                    onClick={handleSearchSubmit}
                    className="focus:outline-none flex items-center"
                  >
                    <Search
                      size={16}
                      className="text-gray-400 hover:text-[#ef4628] transition-colors cursor-pointer"
                    />
                  </button>
                </div>
                <AnimatePresence>
                  {showSearchDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-[120%] w-[380px] bg-white border border-gray-100 shadow-2xl rounded-sm overflow-hidden z-[2000]"
                    >
                      {isSearching ? (
                        <div className="p-6 flex flex-col items-center justify-center text-gray-400">
                          <Loader2 className="animate-spin mb-2" size={24} />
                          <span className="text-xs tracking-widest uppercase">
                            Searching...
                          </span>
                        </div>
                      ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                          {searchResults.pages.length > 0 && (
                            <div className="p-4 border-b border-gray-50">
                              <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                                Pages
                              </div>
                              <div className="flex flex-col gap-2">
                                {searchResults.pages.map((page, idx) => (
                                  <Link
                                    key={idx}
                                    href={page.url}
                                    onClick={() => setShowSearchDropdown(false)}
                                    className="text-sm font-medium text-gray-700 hover:text-[#ef4628] transition-colors flex items-center justify-between"
                                  >
                                    {page.title}{" "}
                                    <ChevronRight
                                      size={14}
                                      className="opacity-50"
                                    />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          {searchResults.products.length > 0 ? (
                            <div className="p-4">
                              <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                                Products
                              </div>
                              <div className="flex flex-col gap-4">
                                {searchResults.products.map((product) => (
                                  <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    onClick={() => setShowSearchDropdown(false)}
                                    className="group flex gap-4 items-center"
                                  >
                                    <div className="relative w-14 h-[70px] bg-gray-50 shrink-0 overflow-hidden rounded-sm">
                                      <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        unoptimized
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs text-gray-500 font-medium mb-1 tracking-wider">
                                        {product.price}
                                      </span>
                                      <span className="text-sm text-gray-900 group-hover:text-[#ef4628] transition-colors line-clamp-2 leading-snug">
                                        {product.title}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                              <Link
                                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                onClick={() => setShowSearchDropdown(false)}
                                className="block mt-4 text-center text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest border-t border-gray-50 pt-4"
                              >
                                View all results
                              </Link>
                            </div>
                          ) : (
                            searchResults.pages.length === 0 && (
                              <div className="p-8 text-center text-sm text-gray-500">
                                {t("mega.no_products") || "No results found."}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-50 rounded-full group transition-colors"
              >
                <ShoppingBag
                  size={22}
                  className="group-hover:text-[#ef4628] transition-colors"
                />
                {totalQty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ef4628] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown (保持不變) */}
        <AnimatePresence>
          {openMega !== "none" && (
            <motion.div
              variants={megaVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-[900]"
              onMouseEnter={() => setOpenMega(openMega)}
              onMouseLeave={() => setOpenMega("none")}
            >
              <div className="max-w-[1440px] mx-auto px-10 py-12 min-h-[300px]">
                <div className="mb-8 border-b border-gray-100 pb-2 flex justify-between items-end">
                  <h3 className="text-[#ef4628] font-bold uppercase tracking-widest text-sm">
                    {openMega === "brand"
                      ? t("mega.brands") || "Brands"
                      : t("mega.categories") || "Categories"}
                  </h3>
                  <Link
                    href="/category"
                    className="text-xs text-gray-400 hover:text-black flex items-center transition-colors"
                  >
                    {t("mega.view_all") || "View All"}{" "}
                    <ChevronRight size={12} />
                  </Link>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                    Loading...
                  </div>
                ) : (
                  <>
                    {(openMega === "brand" ? brandChildren : categoriesChildren)
                      .length > 0 ? (
                      <div className="grid grid-cols-4 lg:grid-cols-6 gap-8">
                        {(openMega === "brand"
                          ? brandChildren
                          : categoriesChildren
                        ).map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group flex flex-col items-center gap-3 text-center"
                          >
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-transparent group-hover:border-[#ef4628] transition-all relative shadow-sm group-hover:shadow-md">
                              {cat.image && cat.image.src ? (
                                <Image
                                  src={cat.image.src}
                                  alt={cat.name}
                                  fill
                                  sizes="80px"
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <span className="text-2xl font-bold text-gray-300">
                                  {cat.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-gray-600 group-hover:text-black uppercase tracking-wider transition-colors">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <p className="text-sm">
                          {t("mega.no_products") || "No products available."}
                        </p>
                        <Link
                          href="/shop"
                          className="mt-2 text-xs border-b border-gray-400 pb-0.5 hover:text-black hover:border-black transition-colors"
                        >
                          {t("mega.view_all") || "View All"}
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[2000] md:hidden backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[2001] shadow-2xl md:hidden flex flex-col"
              >
                <div className="bg-[#ef4628] text-white p-5 flex justify-between items-center shadow-md shrink-0">
                  <span className="font-bold text-lg tracking-widest">
                    MENU
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:rotate-90 transition-transform p-1"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pb-6">
                  {/* 🔥 手機版無框搜尋 + 即時結果下拉 */}
                  <div className="px-6 py-5 border-b border-gray-100 bg-white relative">
                    <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-full focus-within:bg-gray-100 transition-colors border border-transparent focus-within:border-gray-200">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        onFocus={() => {
                          if (searchQuery.trim().length > 1)
                            setShowSearchDropdown(true);
                        }}
                        placeholder={t("navbar.search") || "Search..."}
                        className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 p-0 placeholder:text-gray-400 text-gray-800"
                      />
                      <button
                        onClick={handleSearchSubmit}
                        className="focus:outline-none flex items-center"
                      >
                        <Search size={16} className="text-gray-400" />
                      </button>
                    </div>

                    {/* 手機版即時搜尋結果 */}
                    <AnimatePresence>
                      {showSearchDropdown && searchQuery.trim().length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm"
                        >
                          {isSearching ? (
                            <div className="p-4 flex justify-center text-gray-400">
                              <Loader2 className="animate-spin" size={20} />
                            </div>
                          ) : (
                            <div className="max-h-[250px] overflow-y-auto">
                              {/* Pages */}
                              {searchResults.pages.length > 0 && (
                                <div className="p-3 border-b border-gray-50">
                                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                                    Pages
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    {searchResults.pages.map((page, idx) => (
                                      <Link
                                        key={idx}
                                        href={page.url}
                                        onClick={() => {
                                          setShowSearchDropdown(false);
                                          setIsMenuOpen(false);
                                        }}
                                        className="text-xs font-medium text-gray-700 hover:text-[#ef4628] flex justify-between"
                                      >
                                        {page.title}{" "}
                                        <ChevronRight
                                          size={12}
                                          className="opacity-50"
                                        />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Products */}
                              {searchResults.products.length > 0 ? (
                                <div className="p-3">
                                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                                    Products
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    {searchResults.products.map((product) => (
                                      <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={() => {
                                          setShowSearchDropdown(false);
                                          setIsMenuOpen(false);
                                        }}
                                        className="flex gap-3 items-center group"
                                      >
                                        <div className="relative w-10 h-[50px] bg-gray-50 shrink-0 overflow-hidden rounded-sm">
                                          <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                          />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                          <span className="text-[10px] text-gray-500 font-medium mb-0.5 tracking-wider">
                                            {product.price}
                                          </span>
                                          <span className="text-xs text-gray-900 group-hover:text-[#ef4628] line-clamp-2 leading-snug">
                                            {product.title}
                                          </span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                  <Link
                                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                    onClick={() => {
                                      setShowSearchDropdown(false);
                                      setIsMenuOpen(false);
                                    }}
                                    className="block mt-3 text-center text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-widest border-t border-gray-50 pt-3"
                                  >
                                    View all results
                                  </Link>
                                </div>
                              ) : (
                                searchResults.pages.length === 0 && (
                                  <div className="p-4 text-center text-xs text-gray-500">
                                    {t("mega.no_products") ||
                                      "No results found."}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* --- 會員與購物車 --- */}
                  <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
                    {status === "authenticated" && session ? (
                      <Link
                        href="/member"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 text-gray-800 font-bold tracking-widest mb-6 hover:opacity-80 transition-opacity"
                      >
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={24} className="text-gray-500" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                            Welcome Back
                          </span>
                          <span className="text-sm">{session.user?.name}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex gap-3 mb-6">
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 flex items-center justify-center gap-2 border border-black py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors rounded-sm"
                        >
                          <User size={14} /> Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors rounded-sm"
                        >
                          Register
                        </Link>
                      </div>
                    )}

                    {/* 購物車按鈕 */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="w-full flex items-center justify-between pt-4 border-t border-gray-200 text-gray-800 font-bold tracking-widest uppercase text-sm hover:text-[#ef4628] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={18} />
                        <span>{t("navbar.cart") || "Shopping Cart"}</span>
                      </div>
                      <span className="bg-[#ef4628] text-white text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                        {totalQty}
                      </span>
                    </button>
                  </div>

                  {/* --- 導覽連結清單 --- */}
                  <div className="py-2">
                    {navLinks.map((link) => (
                      <div key={link.key}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-6 py-4 border-b border-gray-50 text-gray-700 font-bold hover:bg-gray-50 hover:text-[#ef4628] transition-all duration-300 uppercase text-sm tracking-widest"
                        >
                          {link.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: 語言切換 & 登出 */}
                <div className="shrink-0 p-6 border-t border-gray-100 bg-white">
                  <div className="text-[10px] font-bold text-gray-400 mb-3 tracking-widest uppercase flex items-center gap-2">
                    <Globe size={12} /> Language / 語言切換
                  </div>
                  <div className="flex gap-2">
                    {[
                      { code: "zh-TW", label: "繁" },
                      { code: "en", label: "EN" },
                      { code: "ko", label: "KR" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold border rounded-sm transition-colors ${
                          router.locale === lang.code
                            ? "border-[#ef4628] text-[#ef4628] bg-[#ef4628]/5"
                            : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  {status === "authenticated" && (
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsMenuOpen(false);
                      }}
                      className="mt-5 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-[#ef4628] transition-colors font-bold tracking-widest uppercase border border-gray-100 py-3 rounded-sm hover:border-[#ef4628]/30 hover:bg-[#ef4628]/5"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SlideTabsExample;
