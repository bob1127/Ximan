// pages/checkout.js
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LS_FORM_KEY = "CHECKOUT_FORM_DATA_V1";
const LS_CVS_KEY = "PAYUNI_CVS_STORE";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();
  const { t } = useTranslation("common"); // 🔥 引入多語系

  const [loading, setLoading] = useState(false);

  // ✅ 門市資訊
  const [cvsStore, setCvsStore] = useState({
    storeId: "",
    storeName: "",
    address: "",
    insularArea: "",
  });

  // ✅ 表單資料（會存 localStorage）
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "台北市",
    address: "",
    postalCode: "",
    shippingMethod: "HOME", // HOME | CVS_711
  });

  // ===== subtotal =====
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const priceNum =
        parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0;
      return acc + priceNum * item.quantity;
    }, 0);
  }, [cartItems]);

  // ✅ 前端顯示用運費（真正金額以後端 create-order 回傳 Woo total 為準）
  const shippingFee = useMemo(() => {
    if (formData.shippingMethod === "HOME") return 80;
    if (formData.shippingMethod === "CVS_711") return 1; // ✅ 先改成 1
    return 0;
  }, [formData.shippingMethod]);

  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /**
   * ✅ (A) 初始化：從 localStorage 還原 formData + cvsStore
   */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_FORM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
          }));
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

  /**
   * ✅ (B) 表單任何變動就存 localStorage
   */
  useEffect(() => {
    try {
      localStorage.setItem(LS_FORM_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  /**
   * ✅ (C) 門市變動也存 localStorage
   */
  useEffect(() => {
    try {
      if (cvsStore?.storeId && cvsStore?.storeName) {
        localStorage.setItem(LS_CVS_KEY, JSON.stringify(cvsStore));
      }
    } catch {}
  }, [cvsStore]);

  /**
   * ✅ (D) 讀取門市回填
   */
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

  // ✅ 開啟 7-11 門市地圖
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

  const handleCheckout = async (e) => {
    e.preventDefault();

    // 🔥 將 Alert 抽換成多語系
    if (!formData.name || !formData.email || !formData.phone) {
      alert(t("checkout.alerts.missing_fields"));
      return;
    }

    if (formData.shippingMethod === "HOME" && !formData.address) {
      alert(t("checkout.alerts.missing_home_address"));
      return;
    }

    if (formData.shippingMethod === "CVS_711") {
      if (!cvsStore.storeId || !cvsStore.storeName) {
        alert(t("checkout.alerts.missing_cvs_store"));
        return;
      }
    }

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

      const MerID = data.MerID || data.MerchantID;
      const EncryptInfo = data.EncryptInfo || data.TradeInfo;
      const HashInfo = data.HashInfo || data.TradeSha;
      const Version = data.Version || "1.0";

      const fields = { MerID, EncryptInfo, HashInfo, Version };

      const missing = Object.entries(fields)
        .filter(([_, v]) => !v)
        .map(([k]) => k);

      if (missing.length > 0) {
        console.error("PayUni missing fields:", missing, fields, data);
        alert(`${t("checkout.alerts.payuni_missing")}${missing.join(", ")}`);
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
      alert(t("checkout.alerts.system_error"));
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return <div className="p-20 text-center">{t("checkout.empty_cart")}</div>;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] pt-24 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-serif">{t("checkout.title")}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {t("checkout.subtitle")}
            </p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-6">
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

            {/* ✅ 配送方式 */}
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

            {/* ✅ 7-11 門市選擇區塊 */}
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
              {/* ✅ 保持 value 不變以配合後端，但顯示文字可透過多語系改變 */}
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
                <option value="台中市">{t("checkout.cities.taichung")}</option>
                <option value="高雄市">{t("checkout.cities.kaohsiung")}</option>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#333] disabled:opacity-50"
            >
              {loading ? t("checkout.btn_processing") : t("checkout.btn_pay")}
            </button>
          </form>
        </div>

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
  );
}

// --- SSG: 服務端注入翻譯 ---
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "zh-TW", ["common"])),
    },
  };
}
