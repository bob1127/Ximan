"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. 初始化：檢查 LocalStorage 是否有 Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user_data");
    
    if (token && storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. 登入功能
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
      
      // 構建使用者物件
      const userPayload = {
        name: data.user_display_name,
        email: data.user_email,
        username: data.user_nicename
      };
      localStorage.setItem("user_data", JSON.stringify(userPayload));
      
      setUserInfo(userPayload);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 3. 註冊功能
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

  // 4. 登出
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUserInfo(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ userInfo, login, register, logout, loading, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};