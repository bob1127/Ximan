"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// --- SVG Icons ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Spinner = ({ colorClass = "border-gray-300" }) => (
  <span className={`w-5 h-5 border-2 ${colorClass} border-t-transparent rounded-full animate-spin`}></span>
);

export default function Register() {
  const [loading, setLoading] = useState(false);

  // --- 核心：Google 快速登入邏輯 ---
  const handleGoogleLogin = () => {
    setLoading(true);

    // 1. 您的 WordPress 後端網址 (從您的截圖中確認的網址)
    const wpUrl = "https://inf.fjg.mybluehost.me/website_19581d8b"; 
    
    // 2. 抓取目前的前端首頁網址
    // 這樣登入後才會自動跳回您的網站 (例如 localhost 或正式網域)
    const currentFrontendUrl = typeof window !== "undefined" ? window.location.origin : "";
    
    // 3. 組合轉址 URL
    // loginSocial=google 告訴 WP 這是 Google 登入
    // redirect=... 告訴 WP 登入成功後要把人送回來這裡
    const targetUrl = `${wpUrl}/wp-login.php?loginSocial=google&redirect=${encodeURIComponent(currentFrontendUrl)}`;

    // 4. 執行轉址 (跳轉去 Google)
    window.location.href = targetUrl;
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center pt-24 pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px]"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-4">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            加入 CIÉMAN 會員，享受尊榮服務
          </p>
        </div>

        {/* --- Google 按鈕 (最優先顯示) --- */}
        <div className="grid grid-cols-1 gap-3 mb-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`flex items-center justify-center py-4 border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors rounded-sm group relative ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <Spinner colorClass="border-gray-500" />
              ) : (
                <>
                   <div className="absolute left-6">
                      <GoogleIcon />
                   </div>
                   <span className="text-sm font-bold text-gray-700 group-hover:text-black uppercase tracking-wide">
                     Continue with Google
                   </span>
                </>
              )}
            </button>
        </div>

        {/* 分隔線 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-gray-400">Or using email</span>
          </div>
        </div>

        {/* 如果您想保留原本的信箱註冊連結 */}
        <div className="space-y-4 text-center">
             {/* 這裡可以放回原本的 input form，或是引導去舊的註冊頁 */}
             <p className="text-xs text-gray-400">
               (您可以將原本的 Email 表單放在這裡)
             </p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          已經有帳號了嗎?{" "}
          <Link
            href="/login"
            className="text-black font-bold underline underline-offset-4 hover:text-[#ef4628] transition-colors"
          >
            登入
          </Link>
        </div>
      </motion.div>
    </main>
  );
}