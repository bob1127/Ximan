import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Navbar from "@/components/Navbar/Navbar.jsx";
import Banner from "@/components/banner";
import Footer from "@/components/ui/footer.jsx";
import Head from "next/head";
import Sidebar from "@/components/Sidebar.js";
import { UserProvider } from "../components/context/UserContext";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function RootLayout({ children }) {
  const [sidebarProduct, setSidebarProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddToCart = (product, quantity, selectedAttributes) => {
    const totalPrice = product.price * quantity;
    const variantId = getVariantId(selectedAttributes);

    setSidebarProduct({
      name: product.name,
      price: product.price,
      quantity,
      totalPrice,
      variant: selectedAttributes,
      variantId,
    });

    setIsSidebarOpen(true);
  };

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  // === SEO & 結構化資料設定 ===
  const siteUrl = "https://ximan-test.vercel.app";
  const siteName = "CIÉMAN 喜曼精品";
  const siteTitle = "CIÉMAN 喜曼精品｜台中二手精品買賣・寄賣・置換";
  const siteDescription =
    "CIÉMAN 喜曼精品位於台中，專營 Hermès、Chanel、Louis Vuitton、Dior 等國際精品品牌，提供二手精品買賣、寄賣、置換服務。所有商品皆經專業鑑定與品況分級，僅販售 100% 正品。";
  const siteImage = `${siteUrl}/default-og-image.jpg`; // 之後可替換成你的 Hero 圖
  const storePhone = "0938-535-870";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteName,
    url: siteUrl,
    image: siteImage,
    telephone: storePhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "中清路一段 428 號",
      addressLocality: "台中市北區",
      addressRegion: "台中市",
      postalCode: "404",
      addressCountry: "TW",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "13:00",
        closes: "20:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/hello.cieman", // IG
      // LINE 沒有公開網址就先不放，之後若有 LINE OA 可加上
    ],
    priceRange: "$$-$$$$",
    description: siteDescription,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        {/* 基本 SEO */}
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta
          name="keywords"
          content="CIÉMAN, 喜曼精品, 台中精品, 二手精品, 精品收購, 精品寄賣, 精品置換, Hermès, Chanel, Louis Vuitton, Dior, Gucci, Loewe, Celine, YSL, Goyard"
        />
        <meta name="author" content="CIÉMAN Boutique" />
        <link rel="icon" href="/logo.ico" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:locale" content="zh_TW" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:image" content={siteImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />

        {/* JSON-LD：品牌 / 門市資訊 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* JSON-LD：網站搜尋 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </Head>

      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <UserProvider>
            <Navbar />
            <Sidebar
              sidebarProduct={sidebarProduct}
              onAddToCart={handleAddToCart}
            />

            {/* 內容 + Lenis 滾動 */}
            <div className="transition duration-1000 ease-out">
              <ReactLenis root>{children}</ReactLenis>
              <Banner />
              <Footer />
            </div>
          </UserProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </>
  );
}
