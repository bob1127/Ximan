import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShoppingBag, Search, Phone, Mail, Globe } from "lucide-react";
import { useUser } from "../../components/context/UserContext"; // 請確認路徑正確
import { useCart } from "../../components/context/CartContext"; // 請確認路徑正確

export const SlideTabsExample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState("none");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalQty, setIsCartOpen } = useCart();
  const [categoriesChildren, setCategoriesChildren] = useState([]);
  const [brandChildren, setBrandChildren] = useState([]);
  
  // 取得 UserContext
  const { userInfo, logout, setUserInfo } = useUser();

  const userMenuRef = useRef(null);
  const navRef = useRef(null);

  // 1. 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. 點擊外部關閉 User Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. 滑鼠離開導航列關閉 Mega Menu
  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMega("none");
      }
    };
    document.addEventListener("mouseover", handleMouseLeave);
    return () => document.removeEventListener("mouseover", handleMouseLeave);
  }, []);

  // 4. Fetch User Data & Categories (核心修改處)
  useEffect(() => {
    // --- (A) 檢查登入狀態 (Google Login 修正版) ---
   // 在 useEffect 裡面
    const checkUserLogin = async () => {
      try {
        const wpApiUrl = "https://inf.fjg.mybluehost.me/website_19581d8b/wp-json/wp/v2/users/me";

        const res = await fetch(wpApiUrl, {
          method: "GET",
          credentials: "include", // ✅ 絕對不能少這行！
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            console.log("登入成功:", data);
            setUserInfo(data); // 更新狀態，Header 就會變了
          }
        } else {
           console.log("未登入 (401)");
        }
      } catch (err) {
        console.error("檢查失敗:", err);
      }
    };
    // --- (B) 抓取分類資料 ---
    async function fetchCategories() {
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
        console.error("分類載入失敗:", err);
      }
    }

    // 執行
    checkUserLogin();
    fetchCategories();
  }, [setUserInfo]); // 依賴 setUserInfo

  const navLinks = [
    { key: "categories", label: "產品類別", href: "/category" },
    { key: "brand", label: "品牌館", href: "/category" },
    { key: "news", label: "最新消息", href: "/news" },
    { key: "SERVICE", label: "服務流程", href: "/service" },
    { key: "FAQ", label: "常見問題", href: "/faq" }, 
    { key: "NOTE", label: "購物須知", href: "/note" },
    { key: "CONTACT", label: "聯繫凱仕", href: "/contact" },
    { key: "ABOUT", label: "公司介紹", href: "/about" },
  ];

  const megaVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div ref={navRef} className="relative font-sans text-gray-800">
      
      {/* --- Top Bar --- */}
      <div className={`bg-[#ef4628] text-white text-[11px] md:text-xs font-medium py-2 px-4 md:px-10 transition-all duration-300 z-[1001] relative ${isScrolled ? 'hidden md:hidden' : 'block'}`}>
        <div className="max-w-[1920px] mx-auto flex justify-between items-center">
          {/* 左側：聯絡資訊 */}
          <div className="flex items-center gap-4 md:gap-6">
            <a href="tel:+886912345678" className="flex items-center gap-2 hover:opacity-80">
              <Phone size={14} />
              <span>+886 912-345-678</span>
            </a>
            <a href="mailto:service@kesh.com" className="flex items-center gap-2 hover:opacity-80 hidden sm:flex">
              <Mail size={14} />
              <span>service@kesh.com</span>
            </a>
          </div>

          {/* 右側：語言與帳戶 */}
          <div className="flex items-center gap-4 md:gap-6 divide-x divide-white/30">
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
              <Globe size={14} />
              <span>繁體中文</span>
            </div>
            <div className="pl-4 md:pl-6 flex gap-3">
               {userInfo ? (
                  <div className="flex items-center gap-3">
                    <span className="font-bold">Hi, {userInfo.name || userInfo.slug}</span>
                    <button onClick={logout} className="underline hover:opacity-80">Logout</button>
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

      {/* --- Main Header --- */}
      <div
        className={`bg-white border-b border-gray-100 transition-all duration-300 w-full z-[1000] ${
          isScrolled ? "fixed top-0 left-0 shadow-md py-2" : "relative py-4"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 md:px-10">
          
          <div className="flex justify-between items-center mb-0 md:mb-2">
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-2 text-gray-800">
                   {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Logo */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-start">
              <Link href="/" className="relative block h-[40px] md:h-[50px] flex items-center justify-center">
                 <h1 className="text-2xl font-bold tracking-widest text-black">
                   KÉSH<span className="text-[#ef4628]">.</span>
                 </h1>
              </Link>
            </div>

            {/* Tools: Search & Cart */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:flex items-center bg-gray-50 px-3 py-2 rounded-full border border-gray-100 w-[200px] lg:w-[250px]">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-600 placeholder-gray-400"
                  />
                  <Search size={18} className="text-gray-400" />
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-50 rounded-full transition-colors group"
              >
                <ShoppingBag size={22} className="text-gray-700 group-hover:text-[#ef4628]" />
                {totalQty > 0 && (
                  <span className="absolute top-0 right-0 bg-[#ef4628] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className={`hidden md:flex justify-center border-t border-gray-50 mt-4 pt-1 ${isScrolled ? 'md:hidden lg:flex' : ''}`}>
             <nav className="flex gap-8 lg:gap-12">
               {navLinks.map((link) => (
                 <div
                   key={link.key}
                   className="relative group py-3"
                   onMouseEnter={() => {
                     if (link.key === "categories") setOpenMega("categories");
                     else if (link.key === "brand") setOpenMega("brand");
                     else setOpenMega("none");
                   }}
                 >
                   <Link
                     href={link.href}
                     className="text-[13px] font-bold tracking-[0.1em] text-gray-700 hover:text-[#ef4628] transition-colors uppercase"
                   >
                     {link.label}
                   </Link>
                   <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ef4628] scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left" />
                 </div>
               ))}
             </nav>
          </div>

        </div>
      </div>

      {/* --- Mega Menu --- */}
      <AnimatePresence>
        {openMega !== "none" && (
          <motion.div
            key="mega-menu"
            variants={megaVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 right-0 z-[950] bg-white border-t border-gray-100 shadow-xl hidden md:block"
            style={{ top: isScrolled ? '65px' : '145px' }}
            onMouseEnter={() => setOpenMega(openMega)}
            onMouseLeave={() => setOpenMega("none")}
          >
            <div className="max-w-[1440px] mx-auto px-8 py-10">
               <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-2">
                 <h3 className="text-[#ef4628] font-bold uppercase tracking-widest text-sm">
                    {openMega === "brand" ? "Featured Brands" : "Categories"}
                 </h3>
               </div>
               
               <div className="grid grid-cols-6 gap-6">
                 {(openMega === "brand" ? brandChildren : categoriesChildren).slice(0, 12).map((item) => (
                    <Link key={item.id} href="/category" className="group flex flex-col gap-3 items-center text-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                       {item.image && (
                         <div className="w-16 h-16 rounded-full overflow-hidden relative border border-gray-100 group-hover:border-[#ef4628] transition-colors">
                           <Image src={item.image.src} alt={item.name} fill className="object-cover" />
                         </div>
                       )}
                       <span className="text-xs font-bold text-gray-600 group-hover:text-black uppercase">
                         {item.name}
                       </span>
                    </Link>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
           <>
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[1001] md:hidden"
                onClick={() => setIsMenuOpen(false)}
             />
             <motion.div
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[1002] shadow-2xl md:hidden flex flex-col"
             >
                <div className="bg-[#ef4628] text-white p-4 flex justify-between items-center">
                   <span className="font-bold text-lg">MENU</span>
                   <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                   {navLinks.map((link) => (
                      <Link 
                        key={link.key} 
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-6 py-4 border-b border-gray-50 text-gray-800 font-medium hover:bg-gray-50 hover:text-[#ef4628]"
                      >
                        {link.label}
                      </Link>
                   ))}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    {userInfo ? (
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                             <User size={20} />
                           </div>
                           <div>
                             <p className="text-sm font-bold">{userInfo.name}</p>
                             <button onClick={logout} className="text-xs text-red-500 mt-1">Logout</button>
                           </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                           <Link href="/login" className="text-center py-2 border border-gray-300 rounded text-sm font-bold">Login</Link>
                           <Link href="/register" className="text-center py-2 bg-[#ef4628] text-white rounded text-sm font-bold">Register</Link>
                        </div>
                    )}
                </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SlideTabsExample;