// pages/checkout.js
"use client";
import React, { useState } from "react";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "台北市",
    address: "",
    postalCode: "",
  });

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum =
      parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

    const cleanCartItems = cartItems.map((item) => ({
      ...item,
      price: parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0,
    }));

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cleanCartItems, customer: formData }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        alert("建立訂單失敗：" + (data.message || "請檢查後端設定"));
        setLoading(false);
        return;
      }

      // ✅（除錯）確認後端回來的欄位
      // console.log("PayUni payload:", data);

      // ✅ 建立 PayUni 表單並自動提交（新版：EncryptInfo / HashInfo）
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl; // ✅ https://api.payuni.com.tw/api/upp
      const fields = {
        MerID: data.MerID,
        EncryptInfo: data.EncryptInfo,
        HashInfo: data.HashInfo,
        Version: data.Version || "1.0",
      };

      // ✅ 最基本的防呆：缺欄位就直接提示，不要送出去才看到紫色錯誤頁
      const missing = Object.entries(fields)
        .filter(([_, v]) => !v)
        .map(([k]) => k);

      if (missing.length > 0) {
        console.error("PayUni missing fields:", missing, fields);
        alert(
          "PayUni 缺少欄位：" +
            missing.join(", ") +
            "（請檢查 /api/create-order 回傳）"
        );
        setLoading(false);
        return;
      }

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("系統錯誤:", error);
      alert("發生錯誤，請稍後再試");
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return <div className="p-20 text-center">購物車是空的</div>;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] pt-24 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-serif">Checkout</h1>
            <p className="text-gray-500 text-sm mt-1">
              CIÉMAN Secure Payment (PayUni)
            </p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-widest">
              Contact Information
            </h2>
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 outline-none focus:border-black"
            />

            <h2 className="text-lg font-bold uppercase tracking-widest mt-8">
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                required
                placeholder="收件人姓名"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 outline-none"
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="手機號碼"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 p-3 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-300 p-3 outline-none bg-white"
              >
                <option value="台北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="台中市">台中市</option>
                <option value="高雄市">高雄市</option>
              </select>

              <input
                type="text"
                name="address"
                required
                placeholder="詳細地址"
                value={formData.address}
                onChange={handleChange}
                className="col-span-2 border border-gray-300 p-3 outline-none"
              />
            </div>

            <input
              type="text"
              name="postalCode"
              placeholder="郵遞區號"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#333] disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>

        <div className="lg:pl-12">
          <div className="bg-gray-50 p-8 sticky top-32">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>

            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="relative w-16 h-20 bg-white border border-gray-100">
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
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                  </div>

                  <div className="text-sm font-medium">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4">
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
