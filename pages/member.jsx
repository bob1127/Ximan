"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Package, Clock, CheckCircle, CreditCard, 
  LogOut, ChevronRight, ShoppingBag, AlertCircle 
} from "lucide-react";

// --- 狀態標籤 helper ---
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
    case "on-hold":
      return { label: "待付款", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <Clock size={14}/> };
    case "processing":
      return { label: "處理中", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Package size={14}/> };
    case "completed":
      return { label: "已完成", color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14}/> };
    case "cancelled":
    case "failed":
      return { label: "已取消", color: "bg-gray-100 text-gray-500 border-gray-200", icon: <AlertCircle size={14}/> };
    default:
      return { label: status, color: "bg-gray-50 text-gray-600 border-gray-200", icon: <Package size={14}/> };
  }
};

export default function MemberProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending'

  // 1. 驗證登入狀態
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2. 抓取訂單資料
  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders(session.user.email);
    }
  }, [session]);

  const fetchOrders = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?email=${email}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. 計算數據
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'on-hold');
  const completedOrders = orders.filter(o => o.status === 'completed');

  // 4. 篩選顯示
  const displayOrders = activeTab === 'pending' ? pendingOrders : orders;

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ef4628]"></div></div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Head>
        <title>會員中心 | KÉSH de¹</title>
      </Head>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- Header 區域 --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-2">My Account</h1>
          <p className="text-gray-500 text-sm">歡迎回來，管理您的訂單與個人資料</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* --- 左側：個人資料卡片 --- */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-md relative">
                   {session.user.image ? (
                     <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={40}/></div>
                   )}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{session.user.name || "會員"}</h2>
                <p className="text-xs text-gray-500 break-all">{session.user.email}</p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`w-full flex items-center justify-between p-3 rounded-md text-sm transition-colors ${activeTab === 'all' ? 'bg-[#ef4628] text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <div className="flex items-center gap-3"><ShoppingBag size={16}/> 所有訂單</div>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{orders.length}</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab("pending")}
                  className={`w-full flex items-center justify-between p-3 rounded-md text-sm transition-colors ${activeTab === 'pending' ? 'bg-[#ef4628] text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <div className="flex items-center gap-3"><CreditCard size={16}/> 待付款</div>
                  {pendingOrders.length > 0 && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">{pendingOrders.length}</span>
                  )}
                </button>

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 p-3 rounded-md text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16}/> 登出帳號
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- 右側：訂單列表 --- */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 儀表板數據小卡 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
               <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-gray-800">
                    NT$ {orders.reduce((acc, curr) => acc + parseFloat(curr.total), 0).toLocaleString()}
                  </p>
               </div>
               <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Completed</p>
                  <p className="text-xl font-bold text-green-600">{completedOrders.length}</p>
               </div>
               <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{pendingOrders.length}</p>
               </div>
            </div>

            {/* 標題與篩選狀態 */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {activeTab === 'pending' ? 'Pending Payments' : 'Recent Orders'}
              </h3>
            </div>

            {loading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>)}
               </div>
            ) : displayOrders.length === 0 ? (
               <div className="bg-white p-12 rounded-lg text-center border border-dashed border-gray-300">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
                  <h4 className="text-lg font-bold text-gray-500 mb-2">目前沒有訂單</h4>
                  <button onClick={() => router.push('/shop')} className="text-[#ef4628] text-sm underline font-bold">去逛逛</button>
               </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {displayOrders.map((order) => {
                    const statusObj = getStatusBadge(order.status);
                    const date = new Date(order.date_created).toLocaleDateString('zh-TW');

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* 訂單基本資訊 */}
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-gray-800">#{order.id}</span>
                                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusObj.color}`}>
                                   {statusObj.icon} {statusObj.label}
                                </span>
                             </div>
                             <div className="text-xs text-gray-500 flex gap-4">
                                <span>{date}</span>
                                <span>{order.line_items.length} 件商品</span>
                             </div>
                          </div>

                          {/* 金額與商品縮圖 (可選) */}
                          <div className="flex-1 md:text-right">
                             <p className="text-sm text-gray-500">訂單金額</p>
                             <p className="text-xl font-bold text-[#ef4628]">NT$ {parseFloat(order.total).toLocaleString()}</p>
                          </div>

                          {/* 動作按鈕 */}
                          <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                             {(order.status === 'pending' || order.status === 'on-hold') && order.payment_url && (
                               <a 
                                 href={order.payment_url} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="px-4 py-2 bg-[#ef4628] text-white text-sm font-bold rounded hover:bg-black transition-colors"
                               >
                                 立即付款
                               </a>
                             )}
                             <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded hover:bg-gray-50 transition-colors">
                               查看詳情
                             </button>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}