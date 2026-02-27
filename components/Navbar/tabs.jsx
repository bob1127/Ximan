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
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";
import { useCart } from "../../components/context/CartContext";
import { useTranslation } from "next-i18next";

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const { data: session, status } = useSession();
  const { totalQty, setIsCartOpen } = useCart();

  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const navRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 🔥 改良版：抓取 Mega Menu 資料 ---
  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true);
        // 取得目前語系
        const currentLang = router.locale || "zh-TW";
        // 轉換給 WP 用的語系代碼
        const wpLang = currentLang === "zh-TW" ? "zh" : currentLang;

        // 我們不再用 slug 抓了，我們直接去你的 Next.js 後端 API (假設你有這支 API)
        // 或是我們直接去 WordPress 抓該語言的所有分類，然後在前端自己分

        // ⚠️ 這裡我改為呼叫你的 WP API (請確保環境變數有抓到，或者你的 /api/categories 支援直接回傳所有該語言分類)
        // 假設你原本的 /api/categories 是可以接受 lang 參數並吐出所有分類的
        const res = await fetch(`/api/categories?lang=${wpLang}`);
        const allCats = res.ok ? await res.json() : [];

        // 如果你的 /api/categories 是一支 Next.js API route，請確保它會去 WP 抓取 &lang=${wpLang}
        // 以下邏輯：找出「品牌館」跟「產品類別」的父分類 ID，再把底下的子分類塞進去
        const brandParent = allCats.find(
          (c) => c.slug.includes("brand") || c.slug.includes("브랜드"),
        );
        const typeParent = allCats.find(
          (c) => c.slug.includes("categories") || c.slug.includes("카테고리"),
        );

        if (brandParent) {
          setBrandChildren(allCats.filter((c) => c.parent === brandParent.id));
        } else {
          setBrandChildren([]); // 沒找到就給空
        }

        if (typeParent) {
          setCategoriesChildren(
            allCats.filter((c) => c.parent === typeParent.id),
          );
        } else {
          setCategoriesChildren([]);
        }
      } catch (error) {
        console.error("選單資料載入失敗:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuData();
  }, [router.locale]);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMega("none");
      }
    };
    document.addEventListener("mouseover", handleMouseLeave);
    return () => document.removeEventListener("mouseover", handleMouseLeave);
  }, []);

  const changeLanguage = (newLocale) => {
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
        {/* Top Bar 橘色條 */}
        <div className="bg-[#ef4628] text-white text-[11px] md:text-xs font-medium py-2 px-4 transition-all duration-300">
          <div className="max-w-[1920px] mx-auto flex justify-between items-center px-4">
            <div className="flex gap-4">
              <a
                href="tel:+886912345678"
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Phone size={14} /> +886 912-345-678
              </a>
              <a
                href="mailto:service@kesh.com"
                className="hidden sm:flex items-center gap-2 hover:opacity-80"
              >
                <Mail size={14} /> service@kesh.com
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
                  <svg
                    className={`w-3 h-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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

              <div className="pl-4 flex gap-3">
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

        {/* Main Navbar 白色導航 */}
        <div
          className={`bg-white border-b border-gray-100 w-full transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}
        >
          <div className="max-w-[1920px] mx-auto px-6 md:px-10 flex justify-between items-center">
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2">
                <Menu size={24} />
              </button>
            </div>

            <Link href="/" className="text-2xl font-bold tracking-widest">
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

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:border-gray-300 transition-colors">
                <input
                  type="text"
                  placeholder={t("navbar.search") || "Search..."}
                  className="bg-transparent text-sm w-32 outline-none placeholder:text-gray-400"
                />
                <Search size={16} className="text-gray-400" />
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
                  <span className="absolute -top-1 -right-1 bg-[#ef4628] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
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
                      ? t("mega.brands")
                      : t("mega.categories")}
                  </h3>
                  <Link
                    href="/category"
                    className="text-xs text-gray-400 hover:text-black flex items-center transition-colors"
                  >
                    {t("mega.view_all")} <ChevronRight size={12} />
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
                        <p className="text-sm">{t("mega.no_products")}</p>
                        <Link
                          href="/shop"
                          className="mt-2 text-xs border-b border-gray-400 pb-0.5 hover:text-black hover:border-black transition-colors"
                        >
                          {t("mega.view_all")}
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
                className="fixed inset-0 bg-black/50 z-[2000] md:hidden backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[2001] shadow-2xl md:hidden flex flex-col"
              >
                <div className="bg-[#ef4628] text-white p-5 flex justify-between items-center shadow-md">
                  <span className="font-bold text-lg tracking-widest">
                    MENU
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:rotate-90 transition-transform"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  {navLinks.map((link) => (
                    <div key={link.key}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-6 py-4 border-b border-gray-50 text-gray-800 font-bold hover:bg-gray-50 hover:text-[#ef4628] hover:pl-8 transition-all duration-300 uppercase text-sm tracking-widest"
                      >
                        {link.label}
                      </Link>
                    </div>
                  ))}
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
