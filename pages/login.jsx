"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "../components/context/UserContext"; // 請確認路徑是否正確
import { useRouter } from "next/router";
import { motion } from "framer-motion";

// --- SVG Icons ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.66-2.797 3.54v.437h4.94l-.749 3.667h-4.191v7.98h-4.018c-.65 0-1.043-.33-1.043-.826z" />
  </svg>
);

const LineIcon = () => (
  <svg className="w-5 h-5 text-[#00B900] fill-current" viewBox="0 0 24 24">
    <path d="M12 .5C5.3.5 0 4.8 0 10.3c0 5 4.3 9.1 10 9.7L8.4 23.5c0 0-.3.7.5.4 3.7-2.3 8.3-5.2 8.3-5.2 4.1-2 6.8-5.1 6.8-8.4C24 4.8 18.7.5 12 .5z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const router = useRouter();

  // --- 一般 Email 登入 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/");
    } else {
      // 移除 HTML 標籤讓錯誤訊息比較乾淨
      const cleanMsg = result.message ? result.message.replace(/<[^>]*>?/gm, "") : "登入失敗";
      setError(cleanMsg);
    }
    setIsLoading(false);
  };

  // --- 社交登入邏輯 (已更新 Google 部分) ---
  const handleSocialLogin = (provider) => {
    
    // 1. 設定 WordPress 後端網址 (與註冊頁相同)
    const wpUrl = "https://inf.fjg.mybluehost.me/website_19581d8b"; 
    
    // 2. 抓取目前的前端網址
    const currentFrontendUrl = typeof window !== "undefined" ? window.location.origin : "";

    if (provider === "google") {
      // 3. Google 登入轉址
      const targetUrl = `${wpUrl}/wp-login.php?loginSocial=google&redirect=${encodeURIComponent(currentFrontendUrl)}`;
      window.location.href = targetUrl;
    } else {
      // 處理其他登入 (Line, FB) - 未來可擴充
      console.log(`Attempting login with ${provider}`);
      alert(`${provider} 登入尚未設定，請先完成 Google 設定。`);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white flex flex-col justify-center items-center pt-20 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[450px]"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-4">
              Login
            </h1>
            <p className="text-gray-500 text-sm">歡迎回到 CIÉMAN</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">
                Email / Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-sm"
                placeholder="請輸入帳號或 Email"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-400 hover:text-black transition-colors underline decoration-gray-300 underline-offset-2"
                >
                  忘記密碼?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-sm"
                placeholder="請輸入密碼"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          {/* --- Social Login Section --- */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white px-4 text-gray-400">Or login with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* LINE (尚未實作) */}
              <button
                type="button"
                onClick={() => handleSocialLogin("line")}
                className="flex items-center justify-center py-3 border border-gray-200 hover:border-[#00B900] hover:bg-[#00B900]/5 transition-colors rounded-sm group"
              >
                <LineIcon />
              </button>
              
              {/* Facebook (尚未實作) */}
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center py-3 border border-gray-200 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-colors rounded-sm"
              >
                <FacebookIcon />
              </button>

              {/* Google (已完成) */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center py-3 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors rounded-sm"
              >
                <GoogleIcon />
              </button>
            </div>
          </div>
          {/* ----------------------------- */}

          <div className="mt-8 text-center text-sm text-gray-600">
            還沒有帳號嗎?{" "}
            <Link
              href="/register"
              className="text-black font-bold underline underline-offset-4 hover:text-[#ef4628] transition-colors"
            >
              立即註冊
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
}