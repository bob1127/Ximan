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

  return (
    <>
      <Head>
        <title>精品網站</title>
        <meta name="description" content="Speed-eSIM | International eSIM" />
        <meta name="keywords" content="產品, 購物, 優惠" />
        <meta name="author" content="" />
        <link rel="icon" href="/logo.ico" />
        <meta property="og:title" content="Speed-eSIM | International eSIM" />
        <meta property="og:description" content="Speed-eSIM | International eSIM" />
        <meta property="og:image" content="/default-og-image.jpg" />
        <meta property="og:url" content="https://www.starislandbaby.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Speed-eSIM | International eSIM" />
        <meta name="twitter:description" content="Speed-eSIM | International eSIM" />
        <meta name="twitter:image" content="/default-og-image.jpg" />
      </Head>

      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <UserProvider>
            <Navbar />
            <Sidebar sidebarProduct={sidebarProduct} onAddToCart={handleAddToCart} />

            {/* ✅ 淡霧散開動畫區塊 */}
            <div className=" transition duration-1000 ease-out">
              <ReactLenis root>
                {children}
              </ReactLenis>
              <Banner />
              <Footer />
            </div>
          </UserProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </>
  );
}