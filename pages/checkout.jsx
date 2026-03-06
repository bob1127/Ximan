// pages/checkout.js
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store, CreditCard, ShieldCheck, ChevronLeft } from "lucide-react"; // 👈 加上 ChevronLeft
// 🔥 引入 PayPal 套件
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";
const LS_FORM_KEY = "CHECKOUT_FORM_DATA_V2";
const LS_CVS_KEY = "PAYUNI_CVS_STORE";

// 🇹🇼 內建完整台灣縣市與郵遞區號資料庫 (最穩定，免安裝套件)
const TW_ZONES = {
  台北市: {
    中正區: "100",
    大同區: "103",
    中山區: "104",
    松山區: "105",
    大安區: "106",
    萬華區: "108",
    信義區: "110",
    士林區: "111",
    北投區: "112",
    內湖區: "114",
    南港區: "115",
    文山區: "116",
  },
  新北市: {
    萬里區: "207",
    金山區: "208",
    板橋區: "220",
    汐止區: "221",
    深坑區: "222",
    石碇區: "223",
    瑞芳區: "224",
    平溪區: "226",
    雙溪區: "227",
    貢寮區: "228",
    新店區: "231",
    坪林區: "232",
    烏來區: "233",
    永和區: "234",
    中和區: "235",
    土城區: "236",
    三峽區: "237",
    樹林區: "238",
    鶯歌區: "239",
    三重區: "241",
    新莊區: "242",
    泰山區: "243",
    林口區: "244",
    蘆洲區: "247",
    五股區: "248",
    八里區: "249",
    淡水區: "251",
    三芝區: "252",
    石門區: "253",
  },
  基隆市: {
    仁愛區: "200",
    信義區: "201",
    中正區: "202",
    中山區: "203",
    安樂區: "204",
    暖暖區: "205",
    七堵區: "206",
  },
  桃園市: {
    中壢區: "320",
    平鎮區: "324",
    龍潭區: "325",
    楊梅區: "326",
    新屋區: "327",
    觀音區: "328",
    桃園區: "330",
    龜山區: "333",
    八德區: "334",
    大溪區: "335",
    復興區: "336",
    大園區: "337",
    蘆竹區: "338",
  },
  新竹市: { 東區: "300", 北區: "300", 香山區: "300" },
  新竹縣: {
    竹北市: "302",
    湖口鄉: "303",
    新豐鄉: "304",
    新埔鎮: "305",
    關西鎮: "306",
    芎林鄉: "307",
    寶山鄉: "308",
    竹東鎮: "310",
    五峰鄉: "311",
    橫山鄉: "312",
    尖石鄉: "313",
    北埔鄉: "314",
    峨眉鄉: "315",
  },
  苗栗縣: {
    竹南鎮: "350",
    頭份市: "351",
    三灣鄉: "352",
    南庄鄉: "353",
    獅潭鄉: "354",
    後龍鎮: "358",
    通霄鎮: "357",
    苑裡鎮: "358",
    苗栗市: "360",
    造橋鄉: "361",
    頭屋鄉: "362",
    公館鄉: "363",
    大湖鄉: "364",
    泰安鄉: "365",
    銅鑼鄉: "366",
    三義鄉: "367",
    西湖鄉: "368",
    卓蘭鎮: "369",
  },
  台中市: {
    中區: "400",
    東區: "401",
    南區: "402",
    西區: "403",
    北區: "404",
    北屯區: "406",
    西屯區: "407",
    南屯區: "408",
    太平區: "411",
    大里區: "412",
    霧峰區: "413",
    烏日區: "414",
    豐原區: "420",
    后里區: "421",
    石岡區: "422",
    東勢區: "423",
    和平區: "424",
    新社區: "426",
    潭子區: "427",
    大雅區: "428",
    神岡區: "429",
    大肚區: "432",
    沙鹿區: "433",
    龍井區: "434",
    梧棲區: "435",
    清水區: "436",
    大甲區: "437",
    外埔區: "438",
    大安區: "439",
  },
  彰化縣: {
    竹南鎮: "350",
    彰化市: "500",
    芬園鄉: "502",
    花壇鄉: "503",
    秀水鄉: "504",
    鹿港鎮: "505",
    福興鄉: "506",
    線西鄉: "507",
    和美鎮: "508",
    伸港鄉: "509",
    員林市: "512",
    社頭鄉: "511",
    大村鄉: "515",
    埔鹽鄉: "516",
    埔心鄉: "513",
    溪湖鎮: "514",
    田中鎮: "520",
    北斗鎮: "521",
    二水鄉: "522",
    埤頭鄉: "516",
    芳苑鄉: "528",
    二林鎮: "526",
    大城鄉: "527",
    竹塘鄉: "525",
    溪州鄉: "524",
    田尾鄉: "522",
    永靖鄉: "512",
  },
  南投縣: {
    竹南鎮: "350",
    苗栗市: "360",
    南投市: "540",
    中寮鄉: "541",
    草屯鎮: "542",
    國姓鄉: "544",
    埔里鎮: "545",
    仁愛鄉: "546",
    名間鄉: "551",
    集集鎮: "552",
    水里鄉: "553",
    魚池鄉: "555",
    信義鄉: "555",
    竹山鎮: "557",
    鹿谷鄉: "558",
  },
  雲林縣: {
    番路鄉: "602",
    斗南鎮: "630",
    大埤鄉: "631",
    虎尾鎮: "632",
    土庫鎮: "633",
    褒忠鄉: "634",
    東勢鄉: "635",
    臺西鄉: "636",
    崙背鄉: "637",
    麥寮鄉: "638",
    斗六市: "640",
    林內鄉: "643",
    古坑鄉: "646",
    莿桐鄉: "647",
    西螺鎮: "638",
    二崙鄉: "637",
    北港鎮: "648",
    水林鄉: "652",
    口湖鄉: "653",
    四湖鄉: "654",
    元長鄉: "655",
  },
  嘉義市: { 東區: "600", 西區: "600" },
  嘉義縣: {
    番路鄉: "602",
    梅山鄉: "603",
    竹崎鄉: "604",
    阿里山鄉: "605",
    中埔鄉: "606",
    大埔鄉: "607",
    水上鄉: "608",
    鹿草鄉: "611",
    太保市: "612",
    朴子市: "613",
    東石鄉: "614",
    六腳鄉: "615",
    新港鄉: "616",
    民雄鄉: "621",
    大林鎮: "622",
    溪口鄉: "623",
    義竹鄉: "624",
    布袋鎮: "625",
  },
  台南市: {
    中西區: "700",
    東區: "701",
    南區: "702",
    北區: "704",
    安平區: "702",
    安南區: "708",
    永康區: "710",
    歸仁區: "711",
    新化區: "712",
    左鎮區: "713",
    玉井區: "714",
    楠西區: "715",
    南化區: "716",
    仁德區: "717",
    關廟區: "718",
    龍崎區: "719",
    官田區: "720",
    麻豆區: "721",
    佳里區: "722",
    西港區: "723",
    七股區: "724",
    將軍區: "725",
    學甲區: "726",
    北門區: "727",
    新營區: "730",
    後壁區: "731",
    白河區: "732",
    東山區: "733",
    六甲區: "734",
    下營區: "735",
    柳營區: "736",
    鹽水區: "737",
    善化區: "741",
    大內區: "742",
    山上區: "743",
    新市區: "744",
    安定區: "745",
  },
  高雄市: {
    新興區: "800",
    前金區: "801",
    苓雅區: "802",
    鹽埕區: "803",
    鼓山區: "804",
    旗津區: "805",
    前鎮區: "806",
    三民區: "807",
    楠梓區: "811",
    小港區: "812",
    左營區: "813",
    仁武區: "814",
    大社區: "815",
    岡山區: "820",
    路竹區: "821",
    阿蓮區: "822",
    田寮區: "823",
    燕巢區: "824",
    橋頭區: "825",
    梓官區: "826",
    彌陀區: "827",
    永安區: "828",
    湖內區: "829",
    鳳山區: "830",
    大寮區: "831",
    林園區: "832",
    鳥松區: "833",
    大樹區: "840",
    旗山區: "842",
    美濃區: "843",
    六龜區: "844",
    內門區: "845",
    杉林區: "846",
    甲仙區: "847",
    桃源區: "848",
    那瑪夏區: "849",
    茂林區: "851",
    茄萣區: "852",
  },
  屏東縣: {
    屏東市: "900",
    三地門鄉: "901",
    霧臺鄉: "902",
    瑪家鄉: "903",
    九如鄉: "904",
    里港鄉: "905",
    高樹鄉: "906",
    鹽埔鄉: "907",
    長治鄉: "908",
    麟洛鄉: "909",
    竹田鄉: "911",
    內埔鄉: "912",
    萬丹鄉: "913",
    潮州鎮: "920",
    泰武鄉: "921",
    來義鄉: "922",
    萬巒鄉: "923",
    崁頂鄉: "924",
    新埤鄉: "925",
    南州鄉: "926",
    林邊鄉: "927",
    東港鎮: "928",
    琉球鄉: "929",
    佳冬鄉: "931",
    新園鄉: "932",
    枋寮鄉: "940",
    枋山鄉: "941",
    春日鄉: "942",
    獅子鄉: "943",
    車城鄉: "944",
    牡丹鄉: "945",
    恆春鎮: "946",
    滿州鄉: "947",
  },
  宜蘭縣: {
    中正區: "202",
    宜蘭市: "260",
    頭城鎮: "261",
    礁溪鄉: "262",
    壯圍鄉: "263",
    員山鄉: "264",
    羅東鎮: "265",
    三星鄉: "266",
    大同鄉: "267",
    五結鄉: "268",
    冬山鄉: "269",
    蘇澳鎮: "270",
    南澳鄉: "272",
  },
  花蓮縣: {
    花蓮市: "970",
    新城鄉: "971",
    秀林鄉: "972",
    吉安鄉: "973",
    壽豐鄉: "974",
    鳳林鎮: "975",
    光復鄉: "976",
    豐濱鄉: "977",
    瑞穗鄉: "978",
    萬榮鄉: "979",
    玉里鎮: "981",
    卓溪鄉: "982",
    富里鄉: "983",
  },
  台東縣: {
    臺東市: "930",
    綠島鄉: "929",
    蘭嶼鄉: "952",
    延平鄉: "953",
    卑南鄉: "954",
    鹿野鄉: "955",
    關山鎮: "956",
    海端鄉: "957",
    池上鄉: "958",
    成功鎮: "961",
    長濱鄉: "962",
    太麻里鄉: "963",
    金峰鄉: "964",
    大武鄉: "965",
    達仁鄉: "966",
  },
  澎湖縣: {
    屏東市: "900",
    馬公市: "880",
    西嶼鄉: "881",
    望安鄉: "882",
    七美鄉: "883",
    白沙鄉: "884",
    湖西鄉: "885",
  },
  金門縣: {
    馬公市: "880",
    金沙鎮: "890",
    金湖鎮: "890",
    金寧鄉: "891",
    金城鎮: "892",
    烈嶼鄉: "893",
    烏坵鄉: "894",
  },
  連江縣: { 南竿鄉: "209", 北竿鄉: "210", 莒光鄉: "211", 東引鄉: "212" },
};

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
    district: "中正區",
    address: "",
    postalCode: "100",
    shippingMethod: "HOME",
    paymentMethod: "PAYUNI",
  });

  // 計算金額
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const priceNum =
        parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0;
      return acc + priceNum * item.quantity;
    }, 0);
  }, [cartItems]);

  const shippingFee = useMemo(() => {
    if (formData.shippingMethod === "HOME") return 80;
    if (formData.shippingMethod === "CVS_711") return 80;
    return 0;
  }, [formData.shippingMethod]);

  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    const firstDistrict = Object.keys(TW_ZONES[selectedCity])[0];
    const zipCode = TW_ZONES[selectedCity][firstDistrict];
    setFormData((prev) => ({
      ...prev,
      city: selectedCity,
      district: firstDistrict,
      postalCode: zipCode,
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    const zipCode = TW_ZONES[formData.city][selectedDistrict];
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      postalCode: zipCode,
    }));
  };

  // 初始化與 LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_FORM_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object")
          setFormData((prev) => ({ ...prev, ...parsed }));
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
      if (cvsStore?.storeId && cvsStore?.storeName)
        localStorage.setItem(LS_CVS_KEY, JSON.stringify(cvsStore));
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
      localStorage.setItem(
        LS_FORM_KEY,
        JSON.stringify({ ...formData, shippingMethod: "CVS_711" }),
      );
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

    const fullAddress = formData.city + formData.district + formData.address;
    const customerPayload = {
      ...formData,
      address: fullAddress,
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
        alert(
          `${t("checkout.alerts.order_failed")} ${data.message || "Error"}`,
        );
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
    return (
      <div className="p-32 text-center text-gray-500 text-lg">
        {t("checkout.empty_cart")}
      </div>
    );

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        "client-id": paypalClientId,
        currency: "TWD",
        intent: "capture",
      }}
    >
      <div className="min-h-screen bg-white">
        <div className="mx-auto text-gray-800 font-sans flex flex-col-reverse lg:flex-row tracking-wide">
          {/* ================= 左側欄 (表單填寫區) ================= */}
          <div className="w-full lg:w-[55%] px-6 py-10 lg:px-16 xl:px-24 lg:py-20 bg-white">
            <div className="max-w-[800px] mx-auto">
              <div className="mb-6">
                <Link
                  href="/cart"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  {/* 如果你的 common.json 有對應翻譯可以改用 t()，這裡先預設中文/英文 */}
                  {router.locale === "en"
                    ? "Return to cart"
                    : router.locale === "ko"
                      ? "장바구니로 돌아가기"
                      : "返回購物車"}
                </Link>
              </div>

              <div className="mb-10 hidden lg:block">
                <h1 className="text-3xl font-serif tracking-wider">
                  {t("checkout.title")}
                </h1>
                <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                  <ShieldCheck size={16} className="text-green-600" />{" "}
                  {t("checkout.subtitle")}
                </p>
              </div>

              <form onSubmit={handlePayUniCheckout} className="space-y-12">
                {/* 1. 聯絡資訊 */}
                <section>
                  <h2 className="text-[1.35rem] font-medium mb-5 text-gray-900">
                    {t("checkout.contact_info")}
                  </h2>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t("checkout.email_placeholder")}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                  />
                </section>

                {/* 2. 配送方式 */}
                <section>
                  <h2 className="text-[1.35rem] font-medium mb-5 text-gray-900">
                    {t("checkout.shipping_method")}
                  </h2>

                  {/* 加寬單選框 UI */}
                  <div className="border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm flex flex-col">
                    <label
                      className={`flex items-center justify-between p-5 cursor-pointer transition border-b border-gray-200 ${formData.shippingMethod === "HOME" ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="HOME"
                          checked={formData.shippingMethod === "HOME"}
                          onChange={handleChange}
                          className="w-[18px] h-[18px] text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="font-medium text-gray-800 text-[15px]">
                          {t("checkout.home_delivery")}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">NT$80</span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-5 cursor-pointer transition ${formData.shippingMethod === "CVS_711" ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="CVS_711"
                          checked={formData.shippingMethod === "CVS_711"}
                          onChange={handleChange}
                          className="w-[18px] h-[18px] text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="font-medium text-gray-800 text-[15px]">
                          {t("checkout.cvs_delivery")}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">NT$80</span>
                    </label>
                  </div>

                  {/* 7-11 選擇門市區塊 */}
                  {formData.shippingMethod === "CVS_711" && (
                    <div className="mt-5 border border-blue-200 bg-blue-50/40 rounded-md p-5 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          <Store size={18} className="text-blue-600" />{" "}
                          {t("checkout.cvs_store")}
                        </div>
                        <button
                          type="button"
                          onClick={openCvsMap}
                          className="px-5 py-2.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black transition shadow-sm"
                        >
                          {cvsStore.storeId
                            ? t("checkout.btn_reselect_store", "重新選擇")
                            : t("checkout.btn_select_store")}
                        </button>
                      </div>
                      {cvsStore.storeId ? (
                        <div className="text-sm text-gray-700 space-y-1 bg-white p-4 rounded border border-gray-200 shadow-sm">
                          <div className="text-base mb-1">
                            <span className="font-bold text-gray-900">
                              {cvsStore.storeName}
                            </span>{" "}
                            <span className="text-gray-500">
                              ({cvsStore.storeId})
                            </span>
                          </div>
                          <div>{cvsStore.address}</div>
                          <button
                            type="button"
                            onClick={clearCvsStore}
                            className="mt-3 text-xs text-red-600 hover:text-red-800 font-medium tracking-wide"
                          >
                            {t("checkout.btn_clear_store")}
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-blue-700/80">
                          {t("checkout.no_store_selected")}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 收件地址表單 - 台灣完整縣市串接 */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={t("checkout.name_placeholder")}
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder={t("checkout.phone_placeholder")}
                      value={formData.phone}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                    />

                    {/* 縣市下拉 - 移除 appearance-none 使用原生箭頭 */}
                    <div className="relative">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleCityChange}
                        className="w-full border border-gray-300 rounded-md p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white shadow-sm cursor-pointer"
                      >
                        {Object.keys(TW_ZONES).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 鄉鎮區下拉 - 移除 appearance-none 使用原生箭頭 */}
                    <div className="relative">
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleDistrictChange}
                        className="w-full border border-gray-300 rounded-md p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white shadow-sm cursor-pointer"
                      >
                        {Object.keys(TW_ZONES[formData.city]).map(
                          (district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    {/* 修復郵遞區號排版：移除 pl-14，改用 flex 佈局對齊 */}
                    <div className="flex items-center border border-gray-300 rounded-md p-4 bg-gray-50 shadow-sm cursor-not-allowed">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-2 shrink-0">
                        {t("checkout.postal_code")}
                      </span>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        readOnly
                        className="w-full bg-transparent text-gray-600 !outline-none border-none pointer-events-none"
                      />
                    </div>

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
                      className="md:col-span-2 border border-gray-300 rounded-md p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                      required={formData.shippingMethod === "HOME"}
                    />
                  </div>
                </section>

                {/* 3. 付款方式 */}
                <section>
                  <h2 className="text-[1.35rem] font-medium mb-1 text-gray-900">
                    {t("checkout.payment_method")}
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    All transactions are secure and encrypted.
                  </p>

                  <div className="border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm flex flex-col">
                    {/* 選項 1: PayUni */}
                    <div
                      className={`border-b border-gray-200 transition ${formData.paymentMethod === "PAYUNI" ? "bg-blue-50/40" : "bg-white"}`}
                    >
                      <label className="flex items-center gap-4 p-5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PAYUNI"
                          checked={formData.paymentMethod === "PAYUNI"}
                          onChange={handleChange}
                          className="w-[18px] h-[18px] text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="font-medium text-gray-800 text-[15px]">
                          信用卡 / ATM 轉帳 (PayUni)
                        </span>
                      </label>
                      {formData.paymentMethod === "PAYUNI" && (
                        <div className="p-5 pt-0 text-center bg-transparent animate-in slide-in-from-top-2 duration-200">
                          <div className="p-8 bg-gray-50 border border-gray-200 rounded shadow-inner text-gray-600 text-sm">
                            <CreditCard className="w-10 h-10 mx-auto mb-3 text-gray-400 stroke-1" />
                            After clicking &quot;Pay now&quot;, you will be
                            redirected to PayUni to complete your purchase
                            securely.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 選項 2: PayPal */}
                    <div
                      className={`border-b border-gray-200 transition ${formData.paymentMethod === "PAYPAL" ? "bg-blue-50/40" : "bg-white"}`}
                    >
                      <label className="flex items-center gap-4 p-5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PAYPAL"
                          checked={formData.paymentMethod === "PAYPAL"}
                          onChange={handleChange}
                          className="w-[18px] h-[18px] text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="font-medium text-gray-800 text-[15px]">
                          PayPal
                        </span>
                      </label>
                      {formData.paymentMethod === "PAYPAL" && (
                        <div className="p-5 pt-0 animate-in slide-in-from-top-2 duration-200 z-0 relative">
                          <div className="bg-gray-50 border border-gray-200 rounded p-6 shadow-inner min-h-[150px]">
                            <PayPalButtons
                              style={{
                                layout: "vertical",
                                color: "gold",
                                shape: "rect",
                                label: "pay",
                              }}
                              onClick={(data, actions) => {
                                if (!validateForm()) return actions.reject();
                                return actions.resolve();
                              }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        currency_code: "TWD",
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
                                  const cleanCartItems = cartItems.map(
                                    (item) => ({
                                      ...item,
                                      price:
                                        parseInt(
                                          String(item.price).replace(
                                            /[^\d]/g,
                                            "",
                                          ),
                                          10,
                                        ) || 0,
                                    }),
                                  );
                                  const customerPayload = {
                                    ...formData,
                                    address:
                                      formData.city +
                                      formData.district +
                                      formData.address,
                                    cvs:
                                      formData.shippingMethod === "CVS_711"
                                        ? cvsStore
                                        : null,
                                  };

                                  const res = await fetch("/api/create-order", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
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
                                    alert(
                                      "WooCommerce Order Error: " +
                                        result.message,
                                    );
                                  }
                                } catch (error) {
                                  alert(t("checkout.alerts.system_error"));
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              onError={(err) => {
                                console.log("PayPal 發生錯誤或被取消:", err);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 選項 3: Apple Pay (Dummy) */}
                    <div
                      className={`border-b border-gray-200 transition ${formData.paymentMethod === "APPLEPAY" ? "bg-blue-50/40" : "bg-white"}`}
                    >
                      <label className="flex items-center gap-4 p-5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="APPLEPAY"
                          checked={formData.paymentMethod === "APPLEPAY"}
                          onChange={handleChange}
                          className="w-[18px] h-[18px] text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="font-medium text-gray-800 text-[15px]">
                          Apple Pay
                        </span>
                      </label>
                      {formData.paymentMethod === "APPLEPAY" && (
                        <div className="p-5 pt-0 text-center animate-in slide-in-from-top-2 duration-200">
                          <div className="p-6 bg-gray-50 border border-gray-200 rounded shadow-inner">
                            <button
                              type="button"
                              className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-md flex justify-center items-center shadow-md transition"
                            >
                              <Image
                                src="/images/svg/006.svg"
                                alt="Apple Pay"
                                width={50}
                                height={24}
                                className="h-6 w-auto"
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 選項 4: 綠界 ECPay (Dummy) */}
                    <div
                      className={`transition ${formData.paymentMethod === "ECPAY" ? "bg-blue-50/40" : "bg-white"}`}
                    >
                      <label className="flex items-center gap-4 p-5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="ECPAY"
                          checked={formData.paymentMethod === "ECPAY"}
                          onChange={handleChange}
                          className="w-[18px] h-[18px] text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="font-medium text-gray-800 text-[15px]">
                          綠界 ECPay
                        </span>
                      </label>
                      {formData.paymentMethod === "ECPAY" && (
                        <div className="p-5 pt-0 text-center animate-in slide-in-from-top-2 duration-200">
                          <div className="p-6 bg-gray-50 border border-gray-200 rounded shadow-inner">
                            <button
                              type="button"
                              className="w-full bg-[#108c4e] hover:bg-[#0d7340] text-white py-4 rounded-md font-bold shadow-md transition text-lg tracking-wide"
                            >
                              Pay with ECPay
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.paymentMethod === "PAYUNI" && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1A1A1A] text-white py-5 text-lg font-medium rounded-md hover:bg-black transition-colors shadow-lg mt-8"
                    >
                      {loading
                        ? t("checkout.btn_processing")
                        : t("checkout.btn_pay")}
                    </button>
                  )}
                </section>
              </form>
            </div>
          </div>

          {/* ================= 右側欄 (訂單摘要區) ================= */}
          <div className="w-full  lg:w-[45%] bg-[#f5f5f5] lg:border-l lg:border-gray-200 px-6 py-10 lg:px-14 xl:px-20 lg:py-20 min-h-screen">
            <div className="sticky max-w-[700px] mx-auto top-[130px]">
              <div className="space-y-5 mb-8 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-5 items-center">
                    <div className="relative w-[72px] h-[72px]  rounded-lg shrink-0">
                      <span className="absolute -top-2.5 -right-2.5 bg-gray-500/95 text-white text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full z-10 shadow-md">
                        {item.quantity}
                      </span>
                      <div className="w-full h-full relative overflow-hidden rounded-lg">
                        <Image
                          src={item.images ? item.images[0] : item.image || ""}
                          alt={item.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-medium text-gray-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-gray-500 mt-1">
                        {item.brand}
                      </p>
                    </div>
                    <div className="text-[15px] font-medium text-gray-900">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-8 border-y border-gray-200 py-7">
                <input
                  type="text"
                  placeholder="Discount code or gift card"
                  className="flex-1 border border-gray-300 rounded-md p-3.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm text-[15px] bg-white"
                />
                <button
                  type="button"
                  className="px-6 bg-gray-200 text-gray-500 font-medium rounded-md text-[15px] cursor-not-allowed hover:bg-gray-300 transition"
                >
                  Apply
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between text-gray-600 text-[15px]">
                  <span>{t("checkout.subtotal")}</span>
                  <span className="font-medium text-gray-900">
                    NT$ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 text-[15px]">
                  <span>{t("checkout.shipping_fee")}</span>
                  <span className="font-medium text-gray-900">
                    NT$ {shippingFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-gray-200 pt-6 mt-6">
                  <span className="text-lg text-gray-900 font-medium">
                    {t("checkout.total")}
                  </span>
                  <div className="flex items-end gap-2.5">
                    <span className="text-sm text-gray-500 mb-1">TWD</span>
                    <span className="text-3xl font-semibold text-gray-900">
                      NT${total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 🔥 替換為你的 SVG 圖片檔案 */}
              <div className="mt-8 flex flex-wrap   gap-2   opacity-80">
                <div className=" mx-2">
                  <Image
                    src="/images/svg/001.svg"
                    alt="Visa"
                    width={38}
                    height={24}
                    className="w-[45px] object-contain"
                  />
                </div>
                <div className="mx-2">
                  <Image
                    src="/images/svg/002.svg"
                    alt="Stripe"
                    width={38}
                    height={24}
                    className="w-[45px] object-contain"
                  />
                </div>
                <div className="mx-2">
                  <Image
                    src="/images/svg/003.svg"
                    alt="PayPal"
                    width={38}
                    height={24}
                    className="w-[45px] object-contain"
                  />
                </div>
                <div className="mx-2">
                  <Image
                    src="/images/svg/004.svg"
                    alt="Mastercard"
                    width={38}
                    height={24}
                    className="w-[45px] object-contain"
                  />
                </div>
                <div className="mx-2">
                  <Image
                    src="/images/svg/005.svg"
                    alt="Maestro"
                    width={38}
                    height={24}
                    className="w-[45px] object-contain"
                  />
                </div>
                <div className="mx-2">
                  <Image
                    src="/images/svg/006.svg"
                    alt="Apple Pay"
                    width={38}
                    height={24}
                    className="w-[45px] object-contain"
                  />
                </div>
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
