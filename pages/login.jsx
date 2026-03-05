"use client";
import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head"; // 🔥 補上 Head 以支援 SEO / 網頁標題
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowLeft, MailCheck } from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// --- Icons ---
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
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Spinner = ({ colorClass = "border-gray-400" }) => (
  <span
    className={`w-5 h-5 border-2 ${colorClass} border-t-transparent rounded-full animate-spin`}
  ></span>
);

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetErrorMsg, setResetErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 修改：動態產生第三方登入的跳轉網址，確保回得去原本的語系
  const handleSocialLogin = async (provider) => {
    try {
      const callbackUrl = router.locale === "zh-TW" ? "/" : `/${router.locale}`;
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 修改：表單登入成功後，帶著原本的語系 (locale) 回到首頁
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) throw new Error(t("login.error_invalid"));

      // router.push(跳轉目標, 顯示的網址, 額外參數)
      router.push("/", "/", { locale: router.locale });
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetErrorMsg("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || t("login.reset_error"));
      }

      setView("email-sent");
    } catch (error) {
      setResetErrorMsg(error.message || t("login.reset_error"));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("login.title")} | KÉSH de¹</title>
      </Head>

      <main className="min-h-screen bg-white flex flex-col justify-center items-center pt-24 pb-24 px-6 overflow-hidden">
        <div className="w-full max-w-[480px] relative">
          <AnimatePresence mode="wait">
            {/* ================= 登入畫面 ================= */}
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold tracking-widest uppercase mb-3">
                    {t("login.title")}
                  </h1>
                  <p className="text-gray-500 text-sm">{t("login.subtitle")}</p>
                </div>

                {/* 社交登入 */}
                <div className="flex flex-col gap-3 mb-8">
                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center py-3.5 border border-gray-300 hover:border-black hover:bg-gray-50 transition-all rounded-sm group relative"
                  >
                    <div className="absolute left-6">
                      <GoogleIcon />
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-black uppercase tracking-wide">
                      {t("login.google")}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("facebook")}
                    className="flex items-center justify-center py-3.5 border border-gray-300 hover:border-[#1877F2] hover:text-[#1877F2] transition-all rounded-sm group relative"
                  >
                    <div className="absolute left-6">
                      <FacebookIcon />
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-[#1877F2] uppercase tracking-wide">
                      {t("login.facebook")}
                    </span>
                  </button>
                </div>

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="bg-white px-4 text-gray-400">
                      {t("login.or_email")}
                    </span>
                  </div>
                </div>

                {/* 表單登入 */}
                <form onSubmit={handleCredentialsLogin} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center rounded">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      {t("login.email_label")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
                      placeholder={t("login.email_placeholder")}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {t("login.password_label")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setView("forgot-password")}
                        className="text-[10px] text-gray-400 hover:text-black underline"
                      >
                        {t("login.forgot_password")}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm pr-12"
                        placeholder={t("login.password_placeholder")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ef4628] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-black transition-colors flex justify-center items-center"
                  >
                    {loading ? (
                      <Spinner colorClass="border-white" />
                    ) : (
                      t("login.sign_in")
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                  {t("login.no_account")}{" "}
                  <Link
                    href="/register"
                    className="text-black font-bold underline underline-offset-4 hover:text-[#ef4628] transition-colors"
                  >
                    {t("login.register")}
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ================= 忘記密碼畫面 ================= */}
            {view === "forgot-password" && (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setView("login")}
                  className="flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-6 group"
                >
                  <ArrowLeft
                    size={16}
                    className="mr-2 group-hover:-translate-x-1 transition-transform"
                  />
                  {t("login.back_to_login")}
                </button>

                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-widest uppercase mb-3">
                    {t("login.reset_title")}
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t("login.reset_subtitle")}
                  </p>
                </div>

                <form
                  onSubmit={handleForgotPasswordSubmit}
                  className="space-y-6"
                >
                  {resetErrorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center rounded">
                      {resetErrorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      {t("login.email_label")}
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
                      placeholder={t("login.email_placeholder")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#ef4628] transition-colors flex justify-center items-center"
                  >
                    {resetLoading ? (
                      <Spinner colorClass="border-white" />
                    ) : (
                      t("login.reset_btn")
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ================= 信件已發送畫面 ================= */}
            {view === "email-sent" && (
              <motion.div
                key="email-sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MailCheck size={32} />
                </div>
                <h1 className="text-2xl font-bold tracking-widest uppercase mb-4">
                  {t("login.sent_title")}
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {t("login.sent_desc_1")} <br />
                  <span className="font-bold text-black">
                    {resetEmail}
                  </span>{" "}
                  <br />
                  {t("login.sent_desc_2")}
                </p>

                <button
                  onClick={() => setView("login")}
                  className="w-full border border-black text-black font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-black hover:text-white transition-colors flex justify-center items-center"
                >
                  {t("login.back_to_login")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
