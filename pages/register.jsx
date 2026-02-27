"use client";
import React, { useState } from "react";
import Link from "next/link";
// 🔥 修正：Pages Router 必須使用 next/router
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

// 🔥 引入多語系套件
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// ... Icons (保持不變) ...
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

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation("common"); // 🔥 啟用翻譯

  const [loadingType, setLoadingType] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = async () => {
    setLoadingType("google");
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setLoadingType(null);
    }
  };
  const handleFacebookLogin = async () => {
    setLoadingType("facebook");
    try {
      await signIn("facebook", { callbackUrl: "/" });
    } catch (error) {
      setLoadingType(null);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingType("email");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error("伺服器連線異常，請稍後再試。");
      }

      if (!res.ok) throw new Error(data.message || "發送失敗");

      setStep(2);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setLoadingType(null);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingType("otp");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error("伺服器回應格式錯誤");
      }

      if (!res.ok) throw new Error(data.message || "註冊失敗");

      // 🔥 翻譯 alert 訊息
      alert(t("register.success_alert"));
      router.push("/login");
    } catch (error) {
      setErrorMsg(error.message);
      setLoadingType(null);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center pt-24 pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px]"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-3">
            {step === 1 ? t("register.title_step1") : t("register.title_step2")}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? t("register.subtitle_step1")
              : `${t("register.subtitle_step2")} ${formData.email}`}
          </p>
        </div>

        {step === 1 && (
          <>
            <div className="flex flex-col gap-3 mb-8">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center py-3.5 border border-gray-300 hover:border-black hover:bg-gray-50 transition-all rounded-sm group relative"
              >
                <div className="absolute left-6">
                  <GoogleIcon />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-black uppercase tracking-wide">
                  {t("register.google")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center py-3.5 border border-gray-300 hover:border-[#1877F2] hover:text-[#1877F2] transition-all rounded-sm group relative"
              >
                <div className="absolute left-6">
                  <FacebookIcon />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-[#1877F2] uppercase tracking-wide">
                  {t("register.facebook")}
                </span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white px-4 text-gray-400">
                  {t("register.or_email")}
                </span>
              </div>
            </div>
          </>
        )}

        {/* 表單 */}
        <form
          onSubmit={step === 1 ? handleSendOtp : handleVerifyAndRegister}
          className="space-y-5"
        >
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center rounded">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            // Step 1: 輸入資料
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("register.username_label")}
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
                  placeholder={t("register.username_placeholder")}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("register.email_label")}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
                  placeholder={t("register.email_placeholder")}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("register.password_label")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm pr-12"
                    placeholder={t("register.password_placeholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingType === "email"}
                className="w-full bg-[#ef4628] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-black transition-colors flex justify-center items-center"
              >
                {loadingType === "email" ? (
                  <Spinner colorClass="border-white" />
                ) : (
                  t("register.send_otp")
                )}
              </button>
            </>
          ) : (
            // Step 2: 驗證碼
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("register.otp_label")}
                </label>
                <input
                  type="text"
                  name="otp"
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors rounded-sm text-center tracking-[5px] text-lg font-bold"
                  placeholder={t("register.otp_placeholder")}
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loadingType === "otp"}
                className="w-full bg-[#ef4628] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-black transition-colors flex justify-center items-center mt-6"
              >
                {loadingType === "otp" ? (
                  <Spinner colorClass="border-white" />
                ) : (
                  t("register.complete_register")
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-4 text-xs text-gray-400 hover:text-black underline"
              >
                {t("register.back_to_edit")}
              </button>
            </motion.div>
          )}
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {t("register.have_account")}{" "}
          <Link
            href="/login"
            className="text-black font-bold underline underline-offset-4 hover:text-[#ef4628] transition-colors"
          >
            {t("register.login")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

// 🔥 加上這段，這頁的 Navbar 就會有正確翻譯了！
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
