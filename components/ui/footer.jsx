"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
export default function Footer() {
  // 定義新的導航連結結構
  const footerLinks = {
    // 主要導航
    explore: [
      { name: "Brands 品牌分類", href: "/brands" },
      { name: "Products 商品分類", href: "/products" },
      { name: "New Arrivals 新品代購", href: "/new-arrival" },
      { name: "Consignment 寄賣服務", href: "/consignment" },
      { name: "Membership 會員專區", href: "/membership" },
    ],
    // 支援與條款
    info: [
      { name: "FAQ 常見問題", href: "/faq" },
      { name: "Registration 政府立案資訊", href: "/registration-info" },
      { name: "Shipping 物流與配送", href: "/shipping" },
      { name: "Terms of Service 服務條款", href: "/terms" },
      { name: "Privacy Policy 隱私權政策", href: "/privacy" },
    ],
  };

  return (
    <footer className="relative bg-[#111111] pt-[150px] pb-10 text-[#f7f7f6] overflow-hidden">
      {/* --- 頂部波浪造型 SVG --- */}
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
          
          {/* 1. 左側：品牌資訊 + Slogan (佔 4 欄) */}
          <div className="lg:col-span-4 flex flex-col items-start">
           <Image src='/images/logo/KESH Logo-2.png' alt='company-logo' placeholder="empty" loading="lazy" width={400} height={300} className="max-w-[140px]" ></Image>
            <div className="text-gray-400 text-sm leading-loose font-light tracking-wide">
              <p className="italic mb-2 opacity-80">
                A Value of Priority. <br/>
                A Beginning of Dreams.
              </p>
            </div>
          </div>

          {/* 2. 中間：連結列表 (佔 5 欄 - 分兩小欄) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            {/* Column A: Explore / Main Menu */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-6 uppercase">
                Explore
              </h3>
              <ul className="flex flex-col gap-4">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-300 tracking-wide"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column B: Info / Support */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-6 uppercase">
                Support
              </h3>
              <ul className="flex flex-col gap-4">
                {footerLinks.info.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-300 tracking-wide"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. 右側：Get in touch (佔 3 欄) */}
          <div className="lg:col-span-3">
            <div className="bg-[#1f1f1f] p-8 md:p-10 rounded-sm h-full flex flex-col justify-center items-start">
              <p className="text-2xl md:text-3xl font-serif mb-2 text-white">
                Contact Us
              </p>
              <p className="text-xs text-gray-400 mb-8 tracking-widest leading-relaxed">
                若有任何商品諮詢或寄賣需求，<br />歡迎隨時聯繫我們。
              </p>

              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-tighter text-black bg-white rounded-full transition duration-300 ease-out hover:bg-gray-200"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-white opacity-0 group-hover:opacity-100"></span>
                <span className="relative text-xs font-bold tracking-widest uppercase">
                  Get in Touch
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* --- 底部版權區 --- */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p className="tracking-wide">
            © {new Date().getFullYear()} KÉSH de¹ Boutique. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
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