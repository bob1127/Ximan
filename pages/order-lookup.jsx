// pages/order-lookup.js
"use client";
import React, { useState } from "react";

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderId.trim() || !email.trim()) {
      setError("請輸入訂單編號與下單 Email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/order-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "查詢失敗，請稍後再試");
        setLoading(false);
        return;
      }

      setOrder(data.order);
    } catch (err) {
      setError("系統錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex justify-center items-center pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-10">
          <h1 className="text-2xl font-serif">訂單查詢</h1>
          <p className="text-gray-500 text-sm mt-1">
            不需會員也可查詢訂單狀態（請輸入訂單編號與下單 Email）
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-lg space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold tracking-wide">
                訂單編號
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="例如：124"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-2 w-full border border-gray-300 p-3 outline-none focus:border-black bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-bold tracking-wide">
                下單 Email
              </label>
              <input
                type="email"
                placeholder="例如：name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-gray-300 p-3 outline-none focus:border-black bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#333] disabled:opacity-50"
          >
            {loading ? "查詢中..." : "查詢訂單"}
          </button>

          <p className="text-xs text-gray-500 leading-relaxed">
            為了保護您的隱私，需同時輸入「訂單編號」與「下單 Email」才可查詢。
          </p>
        </form>
        {/* Result */}
        {order && (
          <div className="mt-10">
            <div className="border-b border-gray-200 pb-3 mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-lg font-bold uppercase tracking-widest">
                訂單明細
              </h2>
              <div className="text-sm text-gray-600">
                #{order.id} ・ {order.date_created}
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="訂單狀態" value={order.status_label} />
              <InfoCard title="付款方式" value={order.payment_method_title} />
              <InfoCard title="總金額" value={`NT$ ${order.total}`} />
            </div>

            {/* Main content */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Items */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="text-sm font-bold uppercase tracking-widest">
                    商品明細
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items.map((it) => (
                    <div
                      key={it.id}
                      className="px-6 py-4 flex items-start justify-between gap-6"
                    >
                      <div className="min-w-0">
                        <div className="font-bold truncate">{it.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          數量：{it.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium whitespace-nowrap">
                        NT$ {it.total}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-between text-sm">
                  <span className="text-gray-600">小計</span>
                  <span className="font-bold">NT$ {order.total}</span>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                <div className="text-sm font-bold uppercase tracking-widest mb-3">
                  收件資訊
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 shrink-0">收件人</span>
                    <span className="text-right">
                      {order.shipping_name || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 shrink-0">城市</span>
                    <span className="text-right">
                      {order.shipping_city || "—"}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 leading-relaxed">
                    （為保護隱私，此處不顯示完整地址。）
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <div className="text-xs text-gray-500 uppercase tracking-widest">
        {title}
      </div>
      <div className="mt-2 text-base md:text-lg font-bold break-words">
        {value || "—"}
      </div>
    </div>
  );
}
