"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// 嘗試從 Context 引入 updateQuantity，如果沒有也沒關係，下方有用 addToCart 做 fallback
import { useCart } from "../components/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  // 解構 updateQuantity (如果 Context 有提供的話)
  const { cartItems, removeFromCart, addToCart, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 計算小計
  const subtotal = cartItems.reduce((acc, item) => {
    const priceStr = String(item.price || "0");
    const priceNum = parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  // 處理數量變更 (修復 TODO)
  const handleQuantity = (item, type) => {
    if (type === "plus") {
      addToCart(item, 1);
    } else {
      if (item.quantity > 1) {
        // 如果 Context 有提供 updateQuantity 就用它
        if (typeof updateQuantity === "function") {
          updateQuantity(item.id, item.quantity - 1);
        } else {
          // Fallback: 如果 addToCart 支援負數 (常見做法)
          addToCart(item, -1);
        }
      } else {
        // 數量為 1 時再按減少，則移除商品
        removeFromCart(item.id);
      }
    }
  };

  if (!mounted) return null;

  return (
    <>
      <main className="min-h-screen bg-white text-[#121212] font-sans pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Header */}
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
              購物車
            </h1>
            <Link
              href="/category"
              className="text-sm underline underline-offset-4 hover:text-[#ef4628] transition-colors"
            >
              繼續購物
            </Link>
          </div>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 border-t border-gray-200">
              <p className="text-lg text-gray-500 mb-6">您的購物車目前是空的</p>
              <Link
                href="/category"
                className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors"
              >
                開始購物
              </Link>
            </div>
          ) : (
            /* Cart Table */
            <div>
              {/* Desktop Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-widest font-bold">
                <div className="col-span-6">商品</div>
                <div className="col-span-3 text-center">數量</div>
                <div className="col-span-3 text-right">總計</div>
              </div>

              {/* Items List */}
              <div className="flex flex-col">
                {cartItems.map((item) => {
                  const priceStr = String(item.price || "0");
                  const unitPrice =
                    parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="py-8 border-b border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                    >
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex gap-6">
                        <Link
                          href={`/product/${item.id}`}
                          className="relative w-24 h-32 md:w-32 md:h-40 bg-gray-50 flex-shrink-0 overflow-hidden"
                        >
                          <Image
                            src={
                              item.images ? item.images[0] : item.image || ""
                            }
                            alt={item.title || "Product"}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="flex flex-col justify-center gap-1">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                            {item.brand}
                          </p>
                          <Link
                            href={`/product/${item.id}`}
                            className="text-sm md:text-base font-bold text-black hover:underline decoration-1 underline-offset-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.price}
                          </p>

                          {/* Mobile Layout: Qty & Remove */}
                          <div className="mt-4 md:hidden flex items-center justify-between w-full max-w-[200px]">
                            <div className="flex items-center border border-gray-300 h-8 w-24">
                              <button
                                onClick={() => handleQuantity(item, "minus")}
                                className="w-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="flex-1 text-center text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantity(item, "plus")}
                                className="w-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 ml-4"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity (Desktop) */}
                      <div className="hidden md:flex col-span-3 justify-center">
                        <div className="flex items-center border border-gray-300 h-10 w-32">
                          <button
                            onClick={() => handleQuantity(item, "minus")}
                            className="w-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="flex-1 text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantity(item, "plus")}
                            className="w-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove (Desktop) */}
                      <div className="hidden md:flex col-span-3 justify-end items-center gap-6">
                        <span className="text-base font-bold tracking-wide">
                          NT$ {itemTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          title="移除商品"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer / Checkout Area */}
              <div className="flex flex-col items-end mt-10 md:mt-16 gap-4">
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-4">
                    <span className="text-base font-bold text-gray-600 uppercase tracking-widest">
                      小計
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-black">
                        NT$ {subtotal.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">
                        含稅。運費將於結帳步驟計算。
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-500 mb-2">
                    安全結帳由 CIÉMAN 提供支援
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#ef4628] transition-colors shadow-lg"
                  >
                    前往結帳
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
