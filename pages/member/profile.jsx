"use client";
import React, { useState, useEffect } from "react";

import { useUser } from "../../components/context/UserContext";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, LogOut, MapPin, Mail, Phone } from "lucide-react";

export default function MemberProfile() {
  const { userInfo, logout, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'orders'
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // 1. 檢查登入狀態
  useEffect(() => {
    if (!loading && !userInfo) {
      router.push("/login");
    }
  }, [userInfo, loading, router]);

  // 2. 抓取訂單資料
  useEffect(() => {
    // 🔍 Debug: 檢查有沒有 email
    console.log("準備抓取訂單，目前 UserInfo:", userInfo);

    if (userInfo?.email && activeTab === "orders") {
      setIsLoadingOrders(true);

      // 🔍 Debug: 印出 API 請求網址
      console.log(`Fetching: /api/member/orders?email=${userInfo.email}`);

      fetch(`/api/member/orders?email=${userInfo.email}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API 回傳資料:", data); // 🔍 Debug: 看看回傳了什麼
          setOrders(Array.isArray(data) ? data : []);
          setIsLoadingOrders(false);
        })
        .catch((err) => {
          console.error("前端抓取錯誤:", err);
          setIsLoadingOrders(false);
        });
    }
  }, [userInfo, activeTab]);

  if (loading || !userInfo) return null; // 或顯示 Loading Spinner

  return (
    <>
      <main className="min-h-screen bg-white text-black font-sans pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center md:text-left border-b border-gray-100 pb-8">
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">
              My Account
            </h1>
            <p className="text-gray-500 text-sm">歡迎回來，{userInfo.name}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Sidebar (Menu) */}
            <aside className="w-full md:w-1/4">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all rounded-md ${
                    activeTab === "profile"
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <User size={18} />
                  個人資料
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all rounded-md ${
                    activeTab === "orders"
                      ? "bg-black text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <ShoppingBag size={18} />
                  歷史訂單
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 rounded-md transition-all mt-4 border-t border-gray-100"
                >
                  <LogOut size={18} />
                  登出
                </button>
              </nav>
            </aside>

            {/* Right Content */}
            <div className="w-full md:w-3/4 min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* 1. 個人資料 Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-200">
                      Profile Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-[#f9f9f9] p-8 rounded-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                            {userInfo.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                              Account
                            </p>
                            <p className="text-sm font-bold">
                              {userInfo.username}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail size={16} />
                            <span>{userInfo.email}</span>
                          </div>
                          {/* 這裡未來可以串接更詳細的 user meta */}
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <User size={16} />
                            <span>會員級別：一般會員</span>
                          </div>
                        </div>
                      </div>

                      {/* 預留給地址資訊 (未來可從 WC 抓 billing address) */}
                      <div className="border border-dashed border-gray-300 p-8 rounded-sm flex flex-col items-center justify-center text-center text-gray-400">
                        <MapPin size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">尚未設定預設運送地址</p>
                        <button className="mt-4 text-xs text-black font-bold underline underline-offset-4 hover:text-[#ef4628]">
                          編輯地址 (Coming Soon)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. 歷史訂單 Tab */}
                {activeTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-200">
                      Order History
                    </h2>

                    {isLoadingOrders ? (
                      <div className="flex justify-center py-20 text-gray-400 text-sm">
                        載入訂單中...
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-sm">
                        <ShoppingBag size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm mb-4">
                          您目前還沒有任何訂單
                        </p>
                        <button
                          onClick={() => router.push("/category")}
                          className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors"
                        >
                          前往購物
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 p-6 rounded-sm hover:border-black transition-colors bg-white"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                  Order ID
                                </p>
                                <p className="font-bold text-lg">#{order.id}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                  Date
                                </p>
                                <p className="text-sm font-medium">
                                  {new Date(
                                    order.date_created
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                  Status
                                </p>
                                <StatusBadge status={order.status} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                  Total
                                </p>
                                <p className="text-sm font-bold">
                                  NT$ {parseInt(order.total).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* 訂單內容簡覽 (只顯示前兩樣) */}
                            <div className="border-t border-gray-100 pt-4 mt-4">
                              {order.line_items.slice(0, 2).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between text-sm py-1"
                                >
                                  <span className="text-gray-600">
                                    {item.name}{" "}
                                    <span className="text-xs text-gray-400">
                                      x{item.quantity}
                                    </span>
                                  </span>
                                  <span>NT$ {item.subtotal}</span>
                                </div>
                              ))}
                              {order.line_items.length > 2 && (
                                <p className="text-xs text-gray-400 mt-2">
                                  ... 以及其他 {order.line_items.length - 2}{" "}
                                  項商品
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// 狀態標籤組件
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
    failed: "bg-red-100 text-red-800",
  };

  const labels = {
    pending: "待付款",
    processing: "處理中",
    completed: "已完成",
    cancelled: "已取消",
    refunded: "已退款",
    failed: "失敗",
  };

  const currentStyle = styles[status] || "bg-gray-100 text-gray-800";
  const label = labels[status] || status;

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${currentStyle}`}>
      {label}
    </span>
  );
};
