"use client";
import React, { useState } from "react";

import Link from "next/link";
import { useUser } from "../components/context/UserContext";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/"); // 登入成功跳轉首頁
    } else {
      // 處理 HTML 錯誤訊息 (移除 WordPress 回傳的 HTML標籤)
      const cleanMsg = result.message.replace(/<[^>]*>?/gm, "");
      setError(cleanMsg);
    }
    setIsLoading(false);
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
