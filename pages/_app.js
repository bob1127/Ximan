// pages/_app.js
import "../src/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "../components/AuthProvider";
import { CartProvider } from "../components/context/CartContext";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <NextUIProvider>
        <CartProvider>
          {/* 🔥 全站頁面轉場：淡入淡出 + 輕微位移 */}
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
              className="min-h-screen"
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </CartProvider>
      </NextUIProvider>
    </AuthProvider>
  );
}

export default MyApp;
