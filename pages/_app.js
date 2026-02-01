// pages/_app.js
import "../src/globals.css";
import { NextUIProvider } from "@nextui-org/react";
// ⬇️ 新增 SessionProvider
import { SessionProvider } from "next-auth/react"; 
import { AuthProvider } from "../components/AuthProvider";
import { UserProvider } from "../components/context/UserContext"; 
import { CartProvider } from "../components/context/CartContext"; 
import Layout from "./Layout"; 

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

// ⬇️ 注意這裡解構出 session
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  return (
    // 1. 最外層：NextAuth Session 提供者
    <SessionProvider session={session}>
      <AuthProvider>
        <UserProvider>
          {/* 3. 購物車狀態 */}
          <CartProvider>
            {/* 4. UI 框架 */}
            <NextUIProvider>
              {/* 5. 視覺佈局 */}
              <Layout>
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

export default MyApp;