"use client";
import React, { useState } from "react";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);

  // 用戶填寫的表單資料
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "台北市",
    address: "",
    postalCode: "",
  });

  // 計算總金額
  const subtotal = cartItems.reduce((acc, item) => {
    const priceStr = String(item.price || "0");
    const priceNum = parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("請填寫所有必填欄位");
      return;
    }

    setLoading(true);

    // 🔥 新增這段：把購物車資料 "洗乾淨"，轉成純數字
    const cleanCartItems = cartItems.map((item) => {
      // 確保將 "NT$ 1,200" 這種格式轉為數字 1200
      const priceStr = String(item.price || "0");
      const priceNum = parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;

      return {
        ...item,
        price: priceNum, // 這裡會變成純數字 (例如: 1)
      };
    });

    try {
      // 1. 呼叫後端 API
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cleanCartItems, // 👈 改傳送洗乾淨的 cleanCartItems
          customer: formData,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        // 2. 建立綠界專用表單
        const form = document.createElement("form");
        form.method = "post";
        form.action = data.paymentUrl; // 綠界金流網址

        // 綠界需要的參數都在 paymentParams 裡面
        const fields = data.paymentParams;

        for (const key in fields) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit(); // 自動跳轉到綠界
      } else {
        console.error("訂單建立失敗:", data);
        alert("建立訂單失敗：" + (data.details || JSON.stringify(data)));
        setLoading(false);
      }
    } catch (error) {
      console.error("系統錯誤:", error);
      alert("發生錯誤，請稍後再試");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="p-20 text-center">購物車是空的</div>;
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] pt-24 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
        {/* 左側表單 (UI 維持不變) */}
        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-serif">Checkout</h1>
            <p className="text-gray-500 text-sm mt-1">
              CIÉMAN Secure Payment (ECPay)
            </p>
          </div>

          <form
            id="checkout-form"
            onSubmit={handleCheckout}
            className="space-y-6"
          >
            <h2 className="text-lg font-bold uppercase tracking-widest">
              Contact Information
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-none focus:border-black outline-none transition-colors"
              />
            </div>

            <h2 className="text-lg font-bold uppercase tracking-widest mt-8">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                required
                placeholder="收件人姓名"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-none focus:border-black outline-none"
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="手機號碼"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-none focus:border-black outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-none focus:border-black outline-none bg-white h-full"
                >
                  <option value="台北市">台北市</option>
                  <option value="新北市">新北市</option>
                  <option value="台中市">台中市</option>
                  <option value="高雄市">高雄市</option>
                  {/* 可自行補完 */}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="詳細地址"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-none focus:border-black outline-none"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                name="postalCode"
                placeholder="郵遞區號"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-none focus:border-black outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>

        {/* 右側：訂單摘要 (維持不變) */}
        <div className="lg:pl-12">
          <div className="bg-gray-50 p-8 sticky top-32">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="relative w-16 h-20 bg-white flex-shrink-0 border border-gray-100">
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                    <Image
                      src={item.images ? item.images[0] : item.image || ""}
                      alt={item.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                  </div>
                  <div className="text-sm font-medium">{item.price}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-gray-200 pt-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
