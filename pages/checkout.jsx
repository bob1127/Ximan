"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCart } from "../components/context/CartContext";
import { useUser } from "../components/context/UserContext";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

export default function Checkout() {
  const { cartItems } = useCart();
  const { userInfo } = useUser();
  const router = useRouter();

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    lastName: "",
    firstName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    phone: "",
  });

  useEffect(() => {
    setMounted(true);
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        email: userInfo.email || "",
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ""), 10) || 0;
    return acc + priceNum * item.quantity;
  }, 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  // 結帳送出邏輯
  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("購物車是空的");
    if (
      !formData.email ||
      !formData.lastName ||
      !formData.firstName ||
      !formData.address ||
      !formData.phone
    ) {
      return alert("請填寫完整聯絡資訊與運送地址");
    }

    setIsLoading(true);

    const payload = {
      customer_id: userInfo ? userInfo.id : 0,
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        address_1: formData.address,
        address_2: formData.apartment,
        city: formData.city,
        state: "",
        postcode: formData.postcode,
        country: "TW",
        email: formData.email,
        phone: formData.phone,
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        address_1: formData.address,
        address_2: formData.apartment,
        city: formData.city,
        state: "",
        postcode: formData.postcode,
        country: "TW",
      },
      // ✅ 修改處：強制傳送名稱與價格，避開假 ID 找不到商品的問題
      line_items: cartItems.map((item) => {
        // 1. 把價格字串 "NT$ 880,000" 轉成純數字 880000
        const priceNum = parseInt(item.price.replace(/[^\d]/g, ""), 10) || 0;

        return {
          product_id: 0, // ⚠️ 設為 0，代表這是「自訂商品」，WooCommerce 就不會去查 ID
          name: item.title, // 強制寫入商品名稱
          quantity: item.quantity,
          total: String(priceNum * item.quantity), // 強制寫入總金額 (字串格式)
        };
      }),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("shopping-cart");
        // 如果有 context 的 clearCart 也可在此呼叫
        router.push(`/thankyou?orderId=${data.orderId}`);
      } else {
        alert("結帳失敗: " + data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("發生錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-[#333]">
      {/* Mobile Header */}
      <div className="md:hidden border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="p-4 flex justify-center bg-white">
          <Link
            href="/"
            className="text-2xl font-bold tracking-widest text-black uppercase"
          >
            CIÉMAN
          </Link>
        </div>
        <div className="bg-[#fafafa] border-t border-gray-200 p-4">
          <button
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            className="flex items-center justify-between w-full text-sm text-[#ef4628]"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-600 flex items-center gap-2 font-medium">
                <ShoppingBag size={18} />
                {isSummaryOpen ? "隱藏訂單摘要" : "顯示訂單摘要"}
              </span>
              {isSummaryOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            <span className="font-bold text-black text-lg">
              NT$ {total.toLocaleString()}
            </span>
          </button>
        </div>
        {isSummaryOpen && (
          <div className="bg-[#fafafa] border-t border-gray-200 p-4 animate-fadeIn">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
            />
          </div>
        )}
      </div>

      {/* Left Column: Form */}
      <div className="w-full md:w-[58%] lg:w-[60%] pt-8 pb-12 px-6 md:px-12 lg:px-20 order-2 md:order-1">
        <div className="md:p-10 p-4 xl:p-20">
          <div className="hidden md:block mb-8">
            <Link
              href="/"
              className="text-3xl font-bold tracking-widest text-black uppercase"
            >
              CIÉMAN
            </Link>
          </div>

          <nav className="flex items-center text-xs mb-8 text-gray-500">
            <Link
              href="/cart"
              className="text-[#ef4628] hover:text-black transition-colors"
            >
              購物車
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="font-bold text-black">資訊</span>
            <span className="mx-2">&gt;</span>
            <span>運送</span>
            <span className="mx-2">&gt;</span>
            <span>付款</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] flex-1 bg-gray-200"></div>
              <span className="text-xs text-gray-500">快速結帳</span>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-[#5A31F4] text-white py-2.5 rounded hover:opacity-90 transition rounded-[4px] text-sm font-bold">
                Shop Pay
              </button>
              <button className="bg-[#FFC439] text-black py-2.5 rounded hover:opacity-90 transition rounded-[4px] text-sm font-bold">
                PayPal
              </button>
              <button className="bg-black text-white py-2.5 rounded hover:opacity-90 transition rounded-[4px] text-sm font-bold">
                GPay
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-gray-200"></div>
            <span className="text-xs text-gray-500">或</span>
            <div className="h-[1px] flex-1 bg-gray-200"></div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">聯絡資訊</h2>
              {!userInfo && (
                <div className="text-sm">
                  已經有帳號了嗎？{" "}
                  <Link
                    href="/login"
                    className="text-[#ef4628] hover:underline"
                  >
                    登入
                  </Link>
                </div>
              )}
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="電子郵件"
              className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4">運送地址</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="姓氏"
                  className="form-input"
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="名字"
                  className="form-input"
                />
              </div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="公司 (選填)"
                className="form-input"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="地址"
                className="form-input"
              />
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="公寓、套房、大樓等 (選填)"
                className="form-input"
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <select className="form-input appearance-none bg-white text-gray-700 font-medium">
                    <option>台灣</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="城市/地區"
                  className="form-input"
                />
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  placeholder="郵遞區號"
                  className="form-input"
                />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="電話號碼"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-8">
            <Link
              href="/cart"
              className="text-sm text-[#ef4628] hover:text-black transition-colors flex items-center gap-1 font-medium"
            >
              &lt; 返回購物車
            </Link>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-[5px] text-sm font-bold tracking-wide hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "處理中..." : "結帳"}
            </button>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-4 flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:underline">
              退款政策
            </Link>
            <Link href="#" className="hover:underline">
              隱私權政策
            </Link>
            <Link href="#" className="hover:underline">
              服務條款
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="hidden md:block w-full md:w-[42%] lg:w-[40%] bg-[#fafafa] border-l border-gray-200 pt-12 px-6 md:px-10 lg:px-14 min-h-screen sticky top-20 h-screen overflow-y-auto order-1 md:order-2">
        <OrderSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
        />
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: black;
          box-shadow: 0 0 0 1px black;
        }
      `}</style>
    </div>
  );
}

// Order Summary Component (不變)
const OrderSummary = ({ cartItems, subtotal, shippingCost, total }) => {
  return (
    <div className="max-w-[450px] mx-auto w-full">
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative w-16 h-16 border border-gray-200 rounded-lg bg-white flex items-center justify-center overflow-visible">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={item.images ? item.images[0] : item.image || ""}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="absolute -top-2 -right-2 bg-gray-500/90 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full z-10">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
            </div>
            <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {item.price}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 my-6"></div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>小計</span>
          <span className="font-medium text-black">
            NT$ {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>運費</span>
          <span className="text-xs text-gray-500">下一步計算</span>
        </div>
      </div>
      <div className="border-t border-gray-200 my-6"></div>
      <div className="flex justify-between items-baseline">
        <span className="text-base font-bold text-gray-800">總計</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">TWD</span>
          <span className="text-2xl font-bold text-black">
            NT$ {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
