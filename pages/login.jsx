"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "./Layout";
import RegisterForm from "../components/RegisterForm";
import { UserIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

// ✅ Client-only import ScrollAnimation
const ScrollAnimation = dynamic(() => import("../components/ScrollAnimation"), {
  ssr: false,
});

const LoginRegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]); // parallax 往上移動

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token && userInfo) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [token, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("登入中...");
    try {
      const res = await fetch(
        "https://dyx.wxv.mybluehost.me/website_a8bfc44c/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        fetchUser(data.token);
        setMessage("登入成功！");
      } else {
        setMessage(data.message || "登入失敗");
      }
    } catch (err) {
      setMessage("登入失敗: " + err.message);
    }
  };

  const fetchUser = async (jwt) => {
    try {
      const res = await fetch(
        "https://dyx.wxv.mybluehost.me/website_a8bfc44c/wp-json/wp/v2/users/me",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const data = await res.json();
      if (!data.code) setUserInfo(data);
    } catch (err) {
      console.error("無法取得使用者資訊", err);
    }
  };

  return (
    <Layout>
      {/* ✅ 背景圖 + Parallax 效果 */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full z-[-10] pointer-events-none"
        style={{
          backgroundImage:
            "url('/assets/—Pngtree—floating-gold-particle--fragment_3247697.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y, // ✅ parallax
        }}
      />
      <ScrollAnimation />
    </Layout>
  );
};

export default LoginRegisterPage;
