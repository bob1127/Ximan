// pages/_app.js
import "../src/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "../components/AuthProvider";
import { UserProvider } from "../components/context/UserContext"; // ✅ 確保引入 UserProvider
import { CartProvider } from "../components/context/CartContext"; // ✅ 確保引入 CartProvider
import Layout from "./Layout"; // ✅ 引入 Layout，讓它全域包覆

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    // 1. 最外層：認證與使用者狀態
    <AuthProvider>
      <UserProvider>
        {/* 2. 購物車狀態 (必須包在 Layout 外面) */}
        <CartProvider>
          {/* 3. UI 框架 */}
          <NextUIProvider>
            {/* 4. 視覺佈局 (Navbar, Sidebar, Footer) */}
            <Layout>
              {/* 5. 頁面轉場動畫 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.asPath}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className=" "
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
            </Layout>
          </NextUIProvider>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;