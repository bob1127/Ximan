// pages/checkout.js
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// 🔥 引入 PayPal 套件
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const LS_FORM_KEY = "CHECKOUT_FORM_DATA_V1";
const LS_CVS_KEY = "PAYUNI_CVS_STORE";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();
  const { t } = useTranslation("common");

  const [loading, setLoading] = useState(false);

  const [cvsStore, setCvsStore] = useState({
    storeId: "",
    storeName: "",
    address: "",
    insularArea: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "台北市",
    address: "",
    postalCode: "",
    shippingMethod: "HOME",
    paymentMethod: "PAYUNI",
  });

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const priceNum =
        parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0;
      return acc + priceNum * item.quantity;
    }, 0);
  }, [cartItems]);

  const shippingFee = useMemo(() => {
    if (formData.shippingMethod === "HOME") return 80;
    if (formData.shippingMethod === "CVS_711") return 1;
    return 0;
  }, [formData.shippingMethod]);

  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_FORM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem(LS_CVS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.storeId && parsed?.storeName) {
          setCvsStore(parsed);
          setFormData((prev) => ({ ...prev, shippingMethod: "CVS_711" }));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_FORM_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  useEffect(() => {
    try {
      if (cvsStore?.storeId && cvsStore?.storeName) {
        localStorage.setItem(LS_CVS_KEY, JSON.stringify(cvsStore));
      }
    } catch {}
  }, [cvsStore]);

  useEffect(() => {
    if (!router.isReady) return;
    const { cvs, storeId, storeName, address, insularArea } =
      router.query || {};
    if (String(cvs) !== "1") return;

    const nextStore = {
      storeId: String(storeId || ""),
      storeName: String(storeName || ""),
      address: String(address || ""),
      insularArea: String(insularArea || ""),
    };

    if (nextStore.storeId && nextStore.storeName) {
      setCvsStore(nextStore);
      setFormData((prev) => ({ ...prev, shippingMethod: "CVS_711" }));
      router.replace("/checkout", undefined, { shallow: true });
    }
  }, [router.isReady, router.query, router]);

  const openCvsMap = () => {
    try {
      const next = { ...formData, shippingMethod: "CVS_711" };
      localStorage.setItem(LS_FORM_KEY, JSON.stringify(next));
    } catch {}
    setFormData((prev) => ({ ...prev, shippingMethod: "CVS_711" }));
    window.location.href =
      "/api/payuni/cvs/map?goodsType=1&lgsType=C2C&shipType=1&mapType=1";
  };

  const clearCvsStore = () => {
    setCvsStore({ storeId: "", storeName: "", address: "", insularArea: "" });
    try {
      localStorage.removeItem(LS_CVS_KEY);
    } catch {}
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert(t("checkout.alerts.missing_fields"));
      return false;
    }
    if (formData.shippingMethod === "HOME" && !formData.address) {
      alert(t("checkout.alerts.missing_home_address"));
      return false;
    }
    if (
      formData.shippingMethod === "CVS_711" &&
      (!cvsStore.storeId || !cvsStore.storeName)
    ) {
      alert(t("checkout.alerts.missing_cvs_store"));
      return false;
    }
    return true;
  };

  const handlePayUniCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const cleanCartItems = cartItems.map((item) => ({
      ...item,
      price: parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0,
    }));

    const customerPayload = {
      ...formData,
      cvs: formData.shippingMethod === "CVS_711" ? cvsStore : null,
    };

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cleanCartItems,
          customer: customerPayload,
          gateway: "payuni",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        alert(`${t("checkout.alerts.order_failed")}${data.message || "Error"}`);
        setLoading(false);
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      const fields = {
        MerID: data.MerID || data.MerchantID,
        EncryptInfo: data.EncryptInfo || data.TradeInfo,
        HashInfo: data.HashInfo || data.TradeSha,
        Version: data.Version || "1.0",
      };

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
      alert(t("checkout.alerts.system_error"));
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return <div className="p-20 text-center">{t("checkout.empty_cart")}</div>;

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"; // 如果抓不到給預設 sandbox 以免崩潰

  return (
    /* 🔥 1. 將 Provider 移到最外層，這是正式版最標準的 options 設定 */
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId, // 使用標準駝峰命名
        currency: "TWD", // 統一使用新台幣結帳
        intent: "capture",
      }}
    >
      <div className="min-h-screen bg-white text-[#1A1A1A] pt-24 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-serif">{t("checkout.title")}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {t("checkout.subtitle")}
              </p>
            </div>

            <form onSubmit={handlePayUniCheckout} className="space-y-6">
              <h2 className="text-lg font-bold uppercase tracking-widest">
                {t("checkout.contact_info")}
              </h2>
              <input
                type="email"
                name="email"
                required
                placeholder={t("checkout.email_placeholder")}
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 outline-none focus:border-black"
              />

              <h2 className="text-lg font-bold uppercase tracking-widest mt-8">
                {t("checkout.shipping_method")}
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="HOME"
                    checked={formData.shippingMethod === "HOME"}
                    onChange={handleChange}
                  />
                  <span>{t("checkout.home_delivery")}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="CVS_711"
                    checked={formData.shippingMethod === "CVS_711"}
                    onChange={handleChange}
                  />
                  <span>{t("checkout.cvs_delivery")}</span>
                </label>
              </div>

              {formData.shippingMethod === "CVS_711" && (
                <div className="border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold">{t("checkout.cvs_store")}</div>
                    <button
                      type="button"
                      onClick={openCvsMap}
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#333]"
                    >
                      {t("checkout.btn_select_store")}
                    </button>
                  </div>
                  {cvsStore.storeId ? (
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-500">
                          {t("checkout.store_label")}
                        </span>
                        <span className="font-medium">
                          {cvsStore.storeName}（{cvsStore.storeId}）
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          {t("checkout.address_label")}
                        </span>
                        <span>{cvsStore.address}</span>
                      </div>
                      <button
                        type="button"
                        onClick={clearCvsStore}
                        className="mt-2 text-xs underline text-gray-600 hover:text-black"
                      >
                        {t("checkout.btn_clear_store")}
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {t("checkout.no_store_selected")}
                    </div>
                  )}
                </div>
              )}

              <h2 className="text-lg font-bold uppercase tracking-widest mt-8">
                {t("checkout.shipping_address")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t("checkout.name_placeholder")}
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={t("checkout.phone_placeholder")}
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
                  <option value="台北市">{t("checkout.cities.taipei")}</option>
                  <option value="新北市">
                    {t("checkout.cities.new_taipei")}
                  </option>
                  <option value="台中市">
                    {t("checkout.cities.taichung")}
                  </option>
                  <option value="高雄市">
                    {t("checkout.cities.kaohsiung")}
                  </option>
                </select>
                <input
                  type="text"
                  name="address"
                  placeholder={
                    formData.shippingMethod === "HOME"
                      ? t("checkout.address_home_req")
                      : t("checkout.address_cvs_opt")
                  }
                  value={formData.address}
                  onChange={handleChange}
                  className="col-span-2 border border-gray-300 p-3 outline-none"
                  required={formData.shippingMethod === "HOME"}
                />
              </div>
              <input
                type="text"
                name="postalCode"
                placeholder={t("checkout.postal_code")}
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 outline-none"
              />

              <h2 className="text-lg font-bold uppercase tracking-widest mt-8 border-t border-gray-200 pt-6">
                {t("checkout.payment_method")}
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYUNI"
                    checked={formData.paymentMethod === "PAYUNI"}
                    onChange={handleChange}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="font-bold">信用卡 / ATM 轉帳 (PayUni)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYPAL"
                    checked={formData.paymentMethod === "PAYPAL"}
                    onChange={handleChange}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="font-bold flex items-center gap-2">
                    PayPal / 國際信用卡
                    <svg
                      className="h-4 w-auto shrink-0"
                      viewBox="0 0 124 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M46.211 32.545H39.22c-1.12 0-2.062-.81-2.227-1.916L32.188 1.916C32.023.81 32.868 0 33.987 0h12.564c2.613 0 4.887.892 6.554 2.58 1.637 1.657 2.457 4.025 2.373 6.848-.198 6.438-4.223 9.65-10.428 9.65h-2.31c-.56 0-1.031.405-1.114.958l-1.39 8.647c-.126.79-1.077 1.432-1.921 1.432h-.826zm-3.666-30.01l-4.184 26.046h5.811l2.452-15.263c.126-.79 1.077-1.432 1.92-1.432h1.666c4.674 0 7.828-2.39 7.978-7.306.06-2.033-.564-3.766-1.782-4.996-1.258-1.272-3.053-1.92-5.184-1.92H42.545zM83.473 32.545h-6.992c-1.12 0-2.062-.81-2.227-1.916L69.45 1.916C69.285.81 70.13 0 71.25 0h12.564c2.613 0 4.887.892 6.554 2.58 1.637 1.657 2.457 4.025 2.373 6.848-.198 6.438-4.223 9.65-10.428 9.65h-2.31c-.56 0-1.031.405-1.114.958l-1.39 8.647c-.125.79-1.076 1.432-1.92 1.432h-.826zm-3.665-30.01L75.624 28.58h5.811l2.451-15.263c.126-.79 1.077-1.432 1.921-1.432h1.666c4.674 0 7.828-2.39 7.978-7.306.06-2.033-.564-3.766-1.782-4.996-1.258-1.272-3.053-1.92-5.184-1.92H79.808z"
                        fill="#003087"
                      />
                      <path
                        d="M123.957 0v2.535h-3.633v9.068h-2.738V2.535h-3.63V0h10.001z"
                        fill="#003087"
                      />
                    </svg>
                  </span>
                </label>
              </div>

              {/* 🔥 2. 這裡只做按鈕的切換顯示，不重新掛載 Provider */}
              {formData.paymentMethod === "PAYUNI" ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#333] disabled:opacity-50 mt-6"
                >
                  {loading
                    ? t("checkout.btn_processing")
                    : t("checkout.btn_pay")}
                </button>
              ) : (
                <div className="mt-6 min-h-[150px] relative z-0">
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "pay",
                    }}
                    onClick={(data, actions) => {
                      const isValid = validateForm();
                      if (!isValid) return actions.reject();
                      return actions.resolve();
                    }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "TWD", // 🌟 統一改為新台幣 TWD 結帳
                              value: total.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        setLoading(true);
                        const details = await actions.order.capture();
                        const cleanCartItems = cartItems.map((item) => ({
                          ...item,
                          price:
                            parseInt(
                              String(item.price).replace(/[^\d]/g, ""),
                              10,
                            ) || 0,
                        }));
                        const customerPayload = {
                          ...formData,
                          cvs:
                            formData.shippingMethod === "CVS_711"
                              ? cvsStore
                              : null,
                        };

                        const res = await fetch("/api/create-order", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            cartItems: cleanCartItems,
                            customer: customerPayload,
                            gateway: "paypal",
                            transactionId: details.id,
                          }),
                        });

                        const result = await res.json();
                        if (res.ok) {
                          alert(t("checkout.alerts.paypal_success"));
                          localStorage.removeItem("CART_ITEMS");
                          router.push("/thankyou");
                        } else {
                          alert("WooCommerce Order Error: " + result.message);
                        }
                      } catch (error) {
                        console.error(error);
                        alert(t("checkout.alerts.system_error"));
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={(err) => {
                      console.log("PayPal 載入或付款發生錯誤或被取消:", err);
                    }}
                  />
                </div>
              )}
            </form>
          </div>

          {/* 右側訂單摘要區塊 */}
          <div className="lg:pl-12">
            <div className="bg-gray-50 p-8 sticky top-32">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
                {t("checkout.order_summary")}
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
                  <span>{t("checkout.subtotal")}</span>
                  <span>NT$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>{t("checkout.shipping_fee")}</span>
                  <span>NT$ {shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4">
                  <span>{t("checkout.total")}</span>
                  <span>NT$ {total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {t("checkout.note_final_amount")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
