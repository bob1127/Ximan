"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  // 模擬網站連結結構
  const footerLinks = {
    shop: [
      { name: "Handbags 包款", href: "/products/handbags" },
      { name: "Small Leather Goods 小皮件", href: "/products/slg" },
      { name: "Accessories 飾品 & 絲巾", href: "/products/accessories" },
      { name: "Shoes 鞋履", href: "/products/shoes" },
      { name: "New Arrivals 最新上架", href: "/products/new" },
    ],
    brands: [
      { name: "Hermès 愛馬仕", href: "/brand/hermes" },
      { name: "Chanel 香奈兒", href: "/brand/chanel" },
      { name: "Louis Vuitton 路易威登", href: "/brand/lv" },
      { name: "Dior 迪奧", href: "/brand/dior" },
    ],
    support: [
      { name: "About Us 公司介紹", href: "/about" },
      { name: "Services 服務流程", href: "/services" },
      { name: "Shopping Notes 購物須知", href: "/notes" },
      { name: "FAQ 常見問題", href: "/faq" },
      { name: "Privacy Policy 隱私權政策", href: "/privacy" },
    ],
  };

  return (
    <footer className="relative bg-[#111111] pt-[150px] pb-10 text-[#f7f7f6] overflow-hidden">
      {/* --- 頂部波浪造型 SVG --- */}
      {/* 注意：fill 必須與 footer 背景色一致 (#111111) */}
      <div className="absolute top-[-1px] left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px] md:h-[150px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C400,150 800,-50 1200,0 L1200,100 L0,100 Z"
            fill="#111111"
          />
        </svg>
      </div>

      <div className="container max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* --- 主要內容區 (Grid Layout) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 border-b border-white/10 pb-20">
          {/* 1. 左側：品牌資訊 (佔 4 欄) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl font-serif tracking-wider mb-6">
              CIÉMAN INC.
            </h2>
            <div className="text-gray-400 text-sm leading-loose font-light">
              <p>台中市北區中清路一段 428 號</p>
              <p>No. 428, Sec. 1, Zhongqing Rd.,</p>
              <p>North Dist., Taichung City, Taiwan</p>
              <p className="mt-4">TAX ID: 12345678</p>
              <p>Email: hello.cieman@gmail.com</p>
            </div>
          </div>

          {/* 2. 中間：網站地圖 (佔 4 欄 - 分兩小欄) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            {/* Column A: Shop & Brands */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-4 uppercase">
                  Shop
                </h3>
                <ul className="flex flex-col gap-3">
                  {footerLinks.shop.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-4 uppercase">
                  Brands
                </h3>
                <ul className="flex flex-col gap-3">
                  {footerLinks.brands.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column B: Support & Info */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-4 uppercase">
                Support
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. 右側：Get in touch (佔 3 欄) */}
          {/* 參考圖片的方塊設計，改為深灰背景以適配 Dark Mode */}
          <div className="lg:col-span-3">
            <div className="bg-[#1f1f1f] p-8 md:p-10 rounded-sm h-full flex flex-col justify-center items-start">
              <p className="text-2xl md:text-3xl font-serif mb-2">
                Get in touch ?
              </p>
              <p className="text-xs text-gray-400 mb-8 tracking-widest">
                如有任何出售、購買或寄賣需求
              </p>

              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-tighter text-black bg-white rounded-full transition duration-300 ease-out hover:bg-gray-200"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-white opacity-0 group-hover:opacity-100"></span>
                <span className="relative text-xs font-bold tracking-widest uppercase">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* --- 底部版權區 --- */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>
            © {new Date().getFullYear()} CIÉMAN Boutique. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="w-[1px] h-3 bg-gray-700"></span>
            <p>
              Designed by{" "}
              <a
                href="https://www.jeek-webdesign.com.tw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white underline decoration-gray-600 underline-offset-4 transition-colors"
              >
                極客網頁設計
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
