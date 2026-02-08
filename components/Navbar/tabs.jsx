"use client"; 
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head"; 
import { useRouter } from "next/navigation"; // 修正：Next.js 13+ App Router 建議用 navigation
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShoppingBag, Search, Phone, Mail, Globe, ChevronRight, LogOut } from "lucide-react";

import { useSession, signOut } from "next-auth/react"; 
import { useCart } from "../../components/context/CartContext"; 

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none");
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: session, status } = useSession();
  const { totalQty, setIsCartOpen } = useCart();
  
  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const navRef = useRef(null);
  const router = useRouter(); // 使用 navigation 的 router

  // --- 滾動監聽 ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 抓取資料 ---
  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true);
        const [resCats, resBrands] = await Promise.all([
          fetch("/api/categories?slug=categories"), 
          fetch("/api/categories?slug=brand"),      
        ]);

        const catsData = resCats.ok ? await resCats.json() : [];
        const brandsData = resBrands.ok ? await resBrands.json() : [];

        setCategoriesChildren(Array.isArray(catsData) ? catsData : []);
        setBrandChildren(Array.isArray(brandsData) ? brandsData : []);
      } catch (error) {
        console.error("選單資料載入失敗:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuData();
  }, []);

  // --- 關閉 Mega Menu ---
  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMega("none");
      }
    };
    document.addEventListener("mouseover", handleMouseLeave);
    return () => document.removeEventListener("mouseover", handleMouseLeave);
  }, []);

  const navLinks = [
    { key: "categories", label: "產品類別", href: "/category", hasMega: true },
    { key: "brand", label: "品牌館", href: "/category", hasMega: true },
    { key: "news", label: "最新消息", href: "/news" },
    { key: "SERVICE", label: "服務流程", href: "/service" },
    { key: "FAQ", label: "常見問題", href: "/faq" }, 
    { key: "NOTE", label: "購物須知", href: "/note" },
    { key: "CONTACT", label: "聯繫凱仕", href: "/contact" },
    { key: "ABOUT", label: "公司介紹", href: "/about" },
  ];

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": navLinks.map(link => link.label),
    "url": navLinks.map(link => `https://www.kesh-de1.com${link.href}`)
  };

  const megaVariants = {
    hidden: { opacity: 0, y: -10, display: "none" },
    visible: { opacity: 1, y: 0, display: "block", transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 }, transitionEnd: { display: "none" } },
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
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
              <a href="tel:+886912345678" className="flex items-center gap-2 hover:opacity-80"><Phone size={14}/> +886 912-345-678</a>
              <a href="mailto:service@kesh.com" className="hidden sm:flex items-center gap-2 hover:opacity-80"><Mail size={14}/> service@kesh.com</a>
            </div>
            <div className="flex gap-4 divide-x divide-white/30">
              <div className="flex items-center gap-1"><Globe size={14}/> 繁體中文</div>
              <div className="pl-4 flex gap-3">
                 
                 {/* 🔥 修改重點 1: 電腦版會員區塊 */}
                 {status === "authenticated" && session ? (
                    <div className="flex items-center gap-3">
                      {/* 點擊名稱或頭像，跳轉至 /member */}
                      <Link href="/member" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {session.user.image && (
                          <img 
                            src={session.user.image} 
                            alt="avatar" 
                            className="w-5 h-5 rounded-full border border-white/50 object-cover"
                          />
                        )}
                        <span>Hi, {session.user.name}</span>
                      </Link>
                      
                      {/* 分隔線 */}
                      <span className="text-white/40">|</span>

                      {/* 獨立的登出按鈕 */}
                      <button 
                        onClick={() => signOut({ callbackUrl: "/" })} 
                        className="hover:text-gray-200 flex items-center gap-1"
                      >
                         Logout
                      </button>
                    </div>
                 ) : (
                    <>
                      <Link href="/login" className="hover:opacity-80">Login</Link>
                      <Link href="/register" className="hover:opacity-80">Register</Link>
                    </>
                 )}

              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar 白色導航 */}
        <div className={`bg-white border-b border-gray-100 w-full transition-all duration-300 ${
           isScrolled ? "py-2" : "py-4"
        }`}>
          <div className="max-w-[1920px] mx-auto px-6 md:px-10 flex justify-between items-center">
            
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2"><Menu size={24}/></button>
            </div>

            <Link href="/" className="text-2xl font-bold tracking-widest">
              KÉSH<span className="text-[#ef4628]">.</span>
            </Link>

            <nav className="hidden md:flex gap-8">
               {navLinks.map((link) => (
                 <div
                   key={link.key}
                   className="relative group py-2 cursor-pointer"
                   onMouseEnter={() => {
                     if (link.hasMega) setOpenMega(link.key);
                     else setOpenMega("none");
                   }}
                 >
                   <Link href={link.href} className="text-[13px] font-bold tracking-widest hover:text-[#ef4628] uppercase transition-colors">
                     {link.label}
                   </Link>
                   <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ef4628] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"/>
                 </div>
               ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <input type="text" placeholder="Search..." className="bg-transparent text-sm w-32 outline-none"/>
                  <Search size={16} className="text-gray-400"/>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-50 rounded-full group">
                <ShoppingBag size={22} className="group-hover:text-[#ef4628] transition-colors"/>
                {totalQty > 0 && <span className="absolute -top-1 -right-1 bg-[#ef4628] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{totalQty}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu (保持不變) */}
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
                      {openMega === "brand" ? "Featured Brands" : "Categories"}
                   </h3>
                   <Link href="/category" className="text-xs text-gray-400 hover:text-black flex items-center transition-colors">
                     View All <ChevronRight size={12}/>
                   </Link>
                 </div>

                 {loading ? (
                    <div className="flex justify-center items-center h-40 text-gray-400 text-sm">Loading...</div>
                 ) : (
                    <>
                      {(openMega === "brand" ? brandChildren : categoriesChildren).length > 0 ? (
                        <div className="grid grid-cols-4 lg:grid-cols-6 gap-8">
                          {(openMega === "brand" ? brandChildren : categoriesChildren).map((cat) => (
                             <Link key={cat.id} href={`/category/${cat.slug}`} className="group flex flex-col items-center gap-3 text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-transparent group-hover:border-[#ef4628] transition-all relative">
                                   {cat.image && cat.image.src ? (
                                     <Image 
                                       src={cat.image.src} 
                                       alt={cat.name} 
                                       fill 
                                       sizes="80px"
                                       className="object-cover transition-transform duration-500 group-hover:scale-110"
                                     />
                                   ) : (
                                     <span className="text-2xl font-bold text-gray-300">{cat.name.charAt(0)}</span>
                                   )}
                                </div>
                                <span className="text-xs font-bold text-gray-600 group-hover:text-black uppercase tracking-wider">
                                  {cat.name}
                                </span>
                             </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                           <p className="text-sm">該分類下沒有產品</p>
                           <Link href="/shop" className="mt-2 text-xs border-b border-gray-400 pb-0.5 hover:text-black hover:border-black transition-colors">
                             看看全部商品
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
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-[2000] md:hidden"
                  onClick={() => setIsMenuOpen(false)}
               />
               <motion.div
                  initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[2001] shadow-2xl md:hidden flex flex-col"
               >
                  <div className="bg-[#ef4628] text-white p-5 flex justify-between items-center">
                     <span className="font-bold text-lg tracking-widest">MENU</span>
                     <button onClick={() => setIsMenuOpen(false)}><X size={24}/></button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4">
                     {navLinks.map((link) => (
                        <div key={link.key}>
                          <Link 
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-6 py-4 border-b border-gray-50 text-gray-800 font-bold hover:bg-gray-50 hover:text-[#ef4628] uppercase text-sm tracking-widest"
                          >
                            {link.label}
                          </Link>
                        </div>
                     ))}
                  </div>
                  
                  {/* 🔥 修改重點 2: 手機版會員區塊 */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                      {status === "authenticated" && session ? (
                          <div className="flex items-center gap-3">
                             <Link href="/member" onClick={() => setIsMenuOpen(false)}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 border border-gray-300">
                                  {session.user.image ? (
                                    <img src={session.user.image} alt="user" className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={20} className="text-gray-500"/>
                                  )}
                                </div>
                             </Link>
                             <div className="flex-1">
                               <Link href="/member" onClick={() => setIsMenuOpen(false)} className="block">
                                  <p className="text-sm font-bold text-gray-800">{session.user.name}</p>
                                  <p className="text-xs text-gray-500">會員中心</p>
                               </Link>
                             </div>
                             <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 text-gray-400 hover:text-red-500">
                                <LogOut size={20} />
                             </button>
                          </div>
                      ) : (
                          <div className="grid grid-cols-2 gap-4">
                             <Link href="/login" className="text-center py-2 border border-gray-300 rounded text-xs font-bold uppercase hover:border-black transition-colors">Login</Link>
                             <Link href="/register" className="text-center py-2 bg-[#ef4628] text-white rounded text-xs font-bold uppercase hover:bg-black transition-colors">Register</Link>
                          </div>
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