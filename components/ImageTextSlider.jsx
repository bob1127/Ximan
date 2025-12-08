"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageReveal from "./ImageReveal";

// ✅ 修改後的資料：CIÉMAN 三大保證
const data = [
  {
    title: "正品鑑定",
    subtitle: "Authenticity Verification",
    price: "100% 正品保證", // 對應原本價格的位置
    description: "每件商品皆經三重檢查與來源確認。",
    detail:
      "CIÉMAN 嚴格把關每一件商品的來源，並透過專業鑑定團隊進行多重細節檢驗，杜絕任何仿冒可能，確保您收到的每一件精品皆為真品，讓您買得安心。",
    mainImages: [
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_2.jpg",
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_5.jpg",
    ],
    subImages: [
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_9.jpg",
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_18.jpg",
    ],
  },
  {
    title: "嚴選品況",
    subtitle: "Condition Selection",
    price: "值得收藏的精品",
    description: "僅販售值得收藏、品況完整的精品。",
    detail:
      "我們深知品況的重要性。CIÉMAN 剔除狀況不佳的商品，專注於挑選成色優良、保養得宜的珍稀包款，讓您以最理想的狀態擁有心儀的時尚單品。",
    mainImages: [
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_14.jpg",
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_4.jpg",
    ],
    subImages: [
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_8.jpg",
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_13.jpg",
    ],
  },
  {
    title: "快速出貨",
    subtitle: "Fast Shipping",
    price: "24–48 小時出貨",
    description: "現貨商品多於 24–48 小時內出貨。",
    detail:
      "無需漫長等待，我們理解您急切的心情。確認訂單後，現貨商品將以最高效率進行精美包裝並寄出，讓時尚迅速抵達您的手中，即刻享受。",
    mainImages: [
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_27.jpg",
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_26.jpg",
    ],
    subImages: [
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_28.jpg",
      "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_23.jpg",
    ],
  },
];

export default function ImageTextSlider({
  autoplay = true,
  interval = 5000, // 自動輪播間隔(ms)
  pauseOnHover = true,
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const isHoveringRef = useRef(false);

  const total = data.length;

  const go = useCallback(
    (dir = 1) => {
      setIndex((p) => {
        const next = (p + dir + total) % total;
        return next;
      });
    },
    [total]
  );

  const next = useCallback(() => {
    go(1);
    restartTimer(); // 手動點擊也重置計時
  }, [go]);

  const prev = useCallback(() => {
    go(-1);
    restartTimer();
  }, [go]);

  // 啟動 / 停止 / 重啟 計時器
  const startTimer = useCallback(() => {
    if (!autoplay || interval <= 0) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      if (pauseOnHover && isHoveringRef.current) return; // 滑入暫停（可選）
      go(1);
    }, interval);
  }, [autoplay, interval, pauseOnHover, go]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const restartTimer = useCallback(() => {
    clearTimer();
    startTimer();
  }, [clearTimer, startTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  // hover 暫停（可開關）
  const onMouseEnter = () => {
    if (!pauseOnHover) return;
    isHoveringRef.current = true;
  };
  const onMouseLeave = () => {
    if (!pauseOnHover) return;
    isHoveringRef.current = false;
  };

  const item = data[index];
  const [leftSrc, rightSrc] = item.mainImages;

  return (
    <div
      className="relative w-[95%] mx-auto lg:flex-row flex-col flex section-part gap-6"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 左側：兩張並排（每次切換都讓左右圖各自跑動畫） */}
      <div className=" w-full lg:w-[65%] grid py-3 grid-cols-2 gap-4">
        {/* 左圖 */}
        <div className="relative aspect-[3/3.5] overflow-hidden">
          <ImageReveal
            key={`slide-${index}-left`} // 以索引+位置作為 key，強制 remount
            src={leftSrc}
            alt={`${item.title}-left`}
            className="h-full"
            delay={0}
            duration={2.2}
            fromScale={1.28}
            toScale={1}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* 右圖 */}
        <div className="relative aspect-[3/3.5] overflow-hidden">
          <ImageReveal
            key={`slide-${index}-right`}
            src={rightSrc}
            alt={`${item.title}-right`}
            className="h-full"
            delay={0.12}
            duration={2.2}
            fromScale={1.28}
            toScale={1}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* 右側：文字 + 縮圖 + 導覽 */}
      <div className=" w-full lg:w-[35%] py-3 px-3 sm:px-10 flex flex-col items-start justify-end relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="title flex justify-between w-full">
              <div>
                <h3 className="font-bold text-[1.8rem]">{item.title}</h3>
                <p className="text-[.85rem] text-gray-600">{item.subtitle}</p>
              </div>
              <div className="text-[.8rem] text-gray-600 tracking-wider">
                {item.price}
              </div>
            </div>

            <div className="content mt-8">
              <h4 className="font-bold text-[1.4rem]">{item.description}</h4>
              <p className="tracking-wider text-[.9rem] my-3 leading-loose text-gray-700">
                {item.detail}
              </p>
            </div>

            <div className="img-wrap flex flex-row mt-4">
              {item.subImages.filter(Boolean).map((img, i) => (
                <div key={i} className="w-1/2 px-1">
                  <Image
                    src={img}
                    alt={`sub-${i + 1}`}
                    width={400}
                    height={300}
                    className="w-full object-cover aspect-[4/3]"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 導覽按鈕 */}
        <div className="absolute top-0 right-0 flex gap-2">
          <button
            onClick={prev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="上一個"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="下一個"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
