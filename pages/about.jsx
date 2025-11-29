"use client";
// import { TransitionLink } from "../../components/utils/TransitionLink";
// import EmblaCarousel from "../../components/EmblaCarousel07/EmblaCarousel";
// import { AnimatedTooltip } from "../../components/ui/animated-tooltip";
import GsapText from "@/components/RevealText/index";
// import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
// import { TextGenerateEffect } from "../../components/ui/text-generate-effect";
// import InfiniteScroll from "../../components/InfiniteScroll/page";
import Image from "next/image";

import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const backgroundImages = [
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_12.jpg",
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_1.jpg",
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex); // 保留上一張索引
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <ReactLenis root className="">
      <div className="content"></div>
    </ReactLenis>
  );
}
