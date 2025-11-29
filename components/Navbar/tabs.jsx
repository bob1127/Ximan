"use client";

import { useUser } from "../../components/context/UserContext";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none"); // "none" | "categories" | "brand"

  // WooCommerce 子分類資料
  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);

  const { userInfo, logout, setUserInfo } = useUser(); // 記得 context 裡要有 setUserInfo

  // ✅ 取得登入者資訊
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(
      "https://inf.fjg.mybluehost.me/website_19581d8b/wp-json/wp/v2/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.code && typeof setUserInfo === "function") {
          setUserInfo(data);
        }
      })
      .catch((err) => {
        console.error("無法取得使用者資訊", err);
      });
  }, [setUserInfo]);

  // ✅ 一進頁面就向 Next API 拿 WooCommerce 分類
  useEffect(() => {
    async function fetchData() {
      try {
        const [resCategories, resBrand] = await Promise.all([
          fetch("/api/categories?slug=categories"),
          fetch("/api/categories?slug=brand"),
        ]);

        const cats = resCategories.ok ? await resCategories.json() : [];
        const brands = resBrand.ok ? await resBrand.json() : [];

        console.log("categories children:", cats);
        console.log("brand children:", brands);

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
      href: "/products",
    },
    { key: "brand", labelTop: "品牌館", labelBottom: "BRAND", href: "/about" },
    { key: "news", labelTop: "最新消息", labelBottom: "NEWS", href: "#" },
    {
      key: "SERVICE",
      labelTop: "服務流程",
      labelBottom: "SERVICE",
      href: "#",
    },
    {
      key: "NOTE",
      labelTop: "購物須知",
      labelBottom: "NOTE",
      href: "/charge",
    },
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

  // mega menu 動畫（滑順效果）
  const megaVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <>
      {/* ✅ 手機選單開啟時的背景遮罩 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[900] pointer-events-none md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 點擊遮罩關閉選單 */}
            <div
              className="w-full h-full bg-black/20 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Navbar */}
      <div className="fixed top-0 left-0 w-full z-[1000] bg-white/100 backdrop-blur-md hover:bg-white transition-colors duration-300">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 md:py-2">
          <Link href="/" className="w-[38px] md:w-[70px]">
            <Image
              src="/images/logo/喜曼＿Logo＿給檔＿黑-02(1).png"
              alt="CIEMAN"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center relative">
            {navLinks.map((link) => {
              const isMega = link.key === "categories" || link.key === "brand";
              const isOpen =
                (link.key === "categories" && openMega === "categories") ||
                (link.key === "brand" && openMega === "brand");

              return (
                <div
                  key={link.key}
                  className="relative"
                  onMouseEnter={() => {
                    if (link.key === "categories") setOpenMega("categories");
                    if (link.key === "brand") setOpenMega("brand");
                  }}
                  onMouseLeave={() => setOpenMega("none")}
                >
                  <Link
                    href={link.href}
                    className="group relative h-10 rounded-full bg-transparent px-6 min-w-[80px] text-neutral-950 flex items-center justify-center"
                  >
                    <span className="relative inline-grid grid-cols-1 overflow-hidden leading-[2.5rem] text-base font-medium text-center">
                      <div className="col-start-1 row-start-1 transition duration-700 group-hover:-translate-y-full group-hover:skew-y-12">
                        {link.labelBottom}
                      </div>
                      <div className="col-start-1 row-start-1 translate-y-full group-hover:translate-y-0 group-hover:skew-y-0 transition duration-700 text-black">
                        {link.labelTop}
                      </div>
                    </span>
                  </Link>

                  {/* ✅ 桌機版滿版 mega menu */}
                  {isMega && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          key={`${link.key}-mega`}
                          variants={megaVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="fixed left-0 right-0 top-[60px] md:top-[64px] z-[950] bg-white shadow-lg border-t border-gray-100"
                        >
                          <div className="max-w-6xl mx-auto px-6 py-6 md:py-8">
                            <div className="mb-4 flex items-baseline justify-between">
                              <div className="text-sm tracking-[0.2em] text-gray-400">
                                {link.labelBottom}
                              </div>
                              <div className="text-xs text-gray-400">
                                {link.labelTop}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                              {(link.key === "categories"
                                ? categoriesChildren
                                : brandChildren
                              ).map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={
                                    link.key === "categories"
                                      ? `/category/${cat.slug}`
                                      : `/brand/${cat.slug}`
                                  }
                                  className="group/item flex flex-col gap-2"
                                >
                                  {cat.image && cat.image.src && (
                                    <div className="overflow-hidden rounded-xl">
                                      <Image
                                        src={cat.image.src}
                                        alt={cat.name}
                                        width={260}
                                        height={180}
                                        className="w-full h-32 md:h-36 object-cover transform group-hover/item:scale-[1.05] transition-transform duration-300"
                                      />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium tracking-wide group-hover/item:text-[#3b57ff] transition-colors">
                                    {cat.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center gap-4">
            {userInfo ? (
              <>
                <span className="text-sm">Hello, {userInfo.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-[#3b57ff] text-white rounded hover:bg-[#2f3dd3] transition"
                >
                  登出
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
              >
                登入
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-black z-[1001]"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu - 優化版動畫 (Slide Down + Opacity) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            // 改用 y 軸位移 + 透明度，比 height 動畫更順暢
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.1, ease: "circOut" }}
            // max-h-[calc(100vh-60px)] 與 overflow-y-auto 確保內容過長時可滾動且不破版
            className="md:hidden fixed top-[60px] left-0 right-0 z-[950] bg-[#f8f8f8] text-[#1b1b1b] shadow-2xl  overflow-hidden max-h-[calc(100vh-70px)] flex flex-col"
          >
            {/* 內層 Scroll Container */}
            <div className="overflow-y-auto p-6 pb-8">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <div key={link.key}>
                    <Link
                      href={link.href}
                      className="py-3 border-b border-black/10 block group flex items-baseline justify-between"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="text-base font-medium text-[#1b1b1b]">
                        {link.labelTop}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-black transition-colors font-medium tracking-wider">
                        {link.labelBottom}
                      </div>
                    </Link>

                    {/* 手機版：子分類 Pill 樣式 */}
                    {link.key === "categories" &&
                      categoriesChildren.length > 0 && (
                        <div className="mt-3 ml-2 flex flex-wrap gap-2 text-xs">
                          {categoriesChildren.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="px-3 py-1.5 rounded-full bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black transition"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    {link.key === "brand" && brandChildren.length > 0 && (
                      <div className="mt-3 ml-2 flex flex-wrap gap-2 text-xs">
                        {brandChildren.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/brand/${cat.slug}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="px-3 py-1.5 rounded-full bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black transition"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* 底部登入/登出區 */}
                <div className="mt-6 pt-6 border-t border-black/10 flex items-center justify-between">
                  {userInfo ? (
                    <>
                      <span className="text-sm text-gray-600 font-medium">
                        Hello, {userInfo.name}
                      </span>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="px-5 py-2 bg-[#1b1b1b] text-white text-xs rounded-full hover:bg-gray-800 transition shadow-md active:scale-95"
                      >
                        登出
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full text-center px-4 py-3 bg-[#1b1b1b] text-white text-sm font-medium rounded-full hover:bg-gray-800 transition shadow-md active:scale-[0.98]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      登入
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SlideTabsExample;
