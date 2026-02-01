"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
// ⬇️ 引入 NextAuth hook
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // ⬇️ 取得 NextAuth 的 session 狀態
  const { data: session, status } = useSession();

  // 1. 監聽登入狀態 (包含 Google 與 LocalStorage)
  useEffect(() => {
    console.log("[UserContext] NextAuth Status:", status);
    console.log("[UserContext] Session Data:", session);
    // 如果 NextAuth 正在載入，先不動作
    if (status === "loading") return;

    if (session?.user) {
      // (A) 如果是用 Google 登入的
      console.log("偵測到 Google Session:", session.user);
      
      // 將 NextAuth 的資料格式化為我們通用的格式
      const googleUser = {
        id: session.user.wpUserId || session.user.id, // 從後端 API 傳回的 WP ID
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
        token: session.accessToken, // 這是 WordPress Token
        loginType: 'google'
      };
      
      setUserInfo(googleUser);
      // 同步存入 localStorage 以備不時之需
      localStorage.setItem("token", session.accessToken);
      
    } else {
      // (B) 如果沒有 Google Session，檢查是否有一般登入的 LocalStorage
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user_data");
      
      if (token && storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [session, status]);

  // 2. 一般帳號密碼登入 (維持原本邏輯)
  const login = async (username, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // 儲存 Token 與使用者資料
      localStorage.setItem("token", data.token);
      
      const userPayload = {
        id: data.id, // 確保 API 有回傳 ID
        name: data.user_display_name,
        email: data.user_email,
        username: data.user_nicename,
        loginType: 'email'
      };
      
      localStorage.setItem("user_data", JSON.stringify(userPayload));
      setUserInfo(userPayload);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 3. 註冊功能 (維持原本邏輯)
  const register = async (formData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 4. 登出 (同時清除 LocalStorage 和 NextAuth Session)
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUserInfo(null);
    
    // 如果是用 Google 登入的，這行會觸發 NextAuth 登出並跳轉
    await nextAuthSignOut({ callbackUrl: "/login" });
    
    // 如果是一般登入，手動跳轉
    if (!session) {
        router.push("/login");
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, login, register, logout, loading, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};