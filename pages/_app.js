// pages/_app.js
import "../src/globals.css"; // 請確認您的 CSS 路徑是否正確
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react"; // 🔥 關鍵：引入 SessionProvider
import { appWithTranslation } from "next-i18next"; // 🔥 引入 i18n 包裝器

// 您的舊有 Context (保留以避免其他沒改到的頁面壞掉)
import { AuthProvider } from "../components/AuthProvider";
import { UserProvider } from "../components/context/UserContext"; 
import { CartProvider } from "../components/context/CartContext"; 

import Layout from "./Layout"; 
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

// 🔥 關鍵：這裡要解構出 session
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  return (
    // 🔥 1. 最外層：讓整個網站都能讀取登入狀態
    <SessionProvider session={session}>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <NextUIProvider>
              <Layout>
                {/* 頁面切換動畫 */}
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
                  >
                    <Component {...pageProps} />
                  </motion.div>
                </AnimatePresence>
              </Layout>
            </NextUIProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

// 🔥 用 appWithTranslation 包起 MyApp 導出
export default appWithTranslation(MyApp);