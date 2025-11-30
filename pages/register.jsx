"use client";
import React, { useState } from "react";

import Link from "next/link";
import { useUser } from "../components/context/UserContext";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useUser();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }

    setIsLoading(true);
    const result = await register({
      email: formData.email,
      username: formData.username || formData.email.split("@")[0],
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
    });

    if (result.success) {
      // 註冊成功，導向登入頁
      alert("註冊成功！請登入");
      router.push("/login");
    } else {
      const cleanMsg = result.message.replace(/<[^>]*>?/gm, "");
      setError(cleanMsg);
    }
    setIsLoading(false);
  };

  return (
    <>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">
                  Last Name
                </label>
                <input
                  name="last_name"
                  onChange={handleChange}
                  className="form-input"
                  placeholder="姓氏"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">
                  First Name
                </label>
                <input
                  name="first_name"
                  onChange={handleChange}
                  className="form-input"
                  placeholder="名字"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="form-input"
                placeholder="電子信箱"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="form-input"
                placeholder="設定密碼"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                className="form-input"
                placeholder="確認密碼"
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
              className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors disabled:opacity-70 mt-4"
            >
              {isLoading ? "Processing..." : "Create"}
            </button>
          </form>

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

      <style jsx>{`
        .form-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border-radius: 0.125rem;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: black;
          box-shadow: 0 0 0 1px black;
        }
      `}</style>
    </>
  );
}
