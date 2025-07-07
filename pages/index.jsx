"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SwiperEsim from "../components/EmblaCarousel01/index";
import HeroSlider from "../components/Slider/Slider";
import Layout from "./Layout";
import ParallaxImage from "../components/ParallaxImage";
import Marquee from "react-marquee-slider";
import Image from "next/image";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import Scroll from "../components/Scroll";
export default function Home() {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Parallax 轉換，分別給不同圖片不同速度
  const y1 = useTransform(scrollY, [0, 1000], [0, 100]); // 慢速
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]); // 中速
  const y3 = useTransform(scrollY, [0, 1000], [0, 80]); // 更慢

  return (
    <Layout>
      {/* 背景圖片 - Parallax */}
      <motion.div
        style={{ y: y1 }}
        className="w-[150px] h-[150px] absolute z-20 top-20 left-0"
      >
        <Image
          src="/images/bg/bg-stuff-06.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="w-[150px] h-[150px] absolute z-20 top-20 right-[20%]"
      >
        <Image
          src="/images/bg/bg-stuff-03.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="w-[150px] h-[150px] absolute z-20 top-[70%] right-[10%]"
      >
        <Image
          src="/images/bg/bg-stuff-02.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>
      <motion.div
        style={{ y: y3 }}
        className="w-[150px] h-[150px] absolute z-20 top-[80%] left-[10%]"
      >
        <Image
          src="/images/bg/bg-stuff-01.png"
          alt="bg-stuff"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>

      {/* Parallax 參考容器 */}
      <div ref={scrollRef} className="relative z-10">
        <div className="flex mt-[100px]">
          <div className="w-1/3 relative z-30">
            <div className="absolute z-30 max-w-[700px] top-[5%] right-[-40%] mix-blend-difference text-black">
              <div className="flex flex-col h-[600px] justify-between">
                <div className="max-w-[400px]">
                  <b className="text-[18px]">D’RENTY INC.</b>
                  <p className="text-[12px]">
                    株式会社ドレンティでは、店舗・内勤スタッフを募集しています。
                    詳細は採用情報をご覧ください。
                  </p>
                </div>
                <div>
                  <h1 className="text-[4.8em] tracking-wider leading-tight">
                    Creating value to add color to people's daily lives.
                  </h1>
                  <p className="mt-4 text-[1.2em]">
                    価値を創造して人々の日常に彩りを
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 relative z-10">
            <div className="w-full h-[600px]">
              <HeroSlider />
            </div>
          </div>

          <div className="w-1/3"></div>
        </div>

        <section className="mt-[20vh] h-full py-[200px]">
          <div className="container flex  max-w-[1920px] w-full lg:w-[80%] mx-auto">
            <div className="left w-1/2 p-10">
              <h2 className="text-[40px] text-left font-[400]">
                價格價值把創製造並且說 <br /> 人各的日常給彩裡把
              </h2>
              <Scroll />
            </div>
            <div className="left justify-between h-[450px] flex  flex-col  w-1/2 px-20">
              <div className="txt">
                <p className="text-[22px] w-2/3 leading-relaxed -tracking-tighter">
                  我們的使命是「創造價值，為人們的日常生活增添色彩」。
                  我們的目標是面對事物的本質， ，創造時代所需的價值，
                  ，透過我們的產品豐富人們的日常生活 。
                </p>
              </div>
              <div className="more-about border-t-1 border-black ">
                <p className="text-[24px] mt-5">Know more about us</p>
              </div>
            </div>
          </div>
        </section>
        <div className="app">
          <section className="relative w-screen h-screen overflow-hidden flex gap-[10em]">
            <div className="relative w-1/2 flex  justify-center">
              <div className="absolute top-0 left-0 w-[100%] h-full overflow-hidden will-change-transform">
                <ParallaxImage src="/QUxMSVRBLTI.png" alt="" />
              </div>
            </div>

            <div className="absolute w-1/4 top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 z-[2]">
              <p className="uppercase  text-[14px] font-medium leading-none text-white">
                Liam Cartwright's 2023 breakout track “Sundown” climbed the
                global charts, achieved multi-platinum status, and amassed over
                1 billion streams in its first year.
              </p>
            </div>

            <div className="w-1/2 relative flex justify-center items-center">
              <div className="relative flex flex-col justify-center items-center gap-[2em]">
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Sunrise
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Echoes Within
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Fading Memories
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Shadow's Edge
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative w-screen h-screen overflow-hidden">
            <div className="relative flex-1 flex flex-col justify-center items-center p-4">
              <p className="underline mb-2 uppercase text-[#191919] text-[14px] font-medium leading-none">
                Introduction
              </p>
              <p className="w-1/2 text-center uppercase text-[#191919] text-[14px] font-medium leading-none">
                Liam Cartwright's 2023 sensation “Sundown” made waves...
              </p>
            </div>
          </section>

          <section className="relative w-screen h-[125vh] overflow-hidden flex gap-[10em]">
            <div className="flex-1 h-1/2 relative">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform">
                <ParallaxImage src="/portraits/portrait4.jpg" alt="" />
              </div>
            </div>
            <div className="w-1/2 relative">
              <div className="relative flex flex-col justify-center items-center gap-[2em]">
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Sunrise
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Echoes Within
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Fading Memories
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
                <div className="text-center flex flex-col">
                  <h1 className="text-[#1b1b1b] text-[80px] font-normal tracking-[-1px] leading-none">
                    Shadow's Edge
                  </h1>
                  <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                    Apple Music / Spotify / YouTube
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/2 relative">
              <div className="w-2/3 absolute top-0 left-0 overflow-hidden will-change-transform">
                <ParallaxImage src="/img-index05.jpg.webp" alt="" />
              </div>
            </div>
          </section>

          <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
            <div className="w-full absolute top-0 left-0 overflow-hidden will-change-transform">
              <ParallaxImage
                src="https://cdn.shopify.com/s/files/1/0529/8890/3579/files/img-index02.jpg?v=1615512698"
                alt=""
              />
            </div>
            <div className="relative text-center">
              <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                Be the
              </p>
              <h1 className="uppercase text-white text-[80px] font-normal tracking-[-1px] leading-none">
                First to know
              </h1>
              <p className="w-[75%] mx-auto mt-4 uppercase text-[#191919] text-[14px] font-medium leading-none">
                Want to hear the latest news on my upcoming music releases...
              </p>
              <button className="border-none outline-none uppercase text-[12px] font-semibold mt-1 mb-1 px-3 py-1 text-[#0f0f0f] bg-[#dbccc0] rounded-full">
                Join the newsletter
              </button>
            </div>
          </section>

          <section className="flex p-4 bg-[#f7f7f6]">
            <div className="flex-[4] h-full flex flex-col justify-between">
              <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                Instagram / Tiktok / Discord
              </p>
              <div>
                <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                  Menu
                </p>
                <h1 className="uppercase text-[80px] font-normal tracking-[-1px] leading-none">
                  Tour
                </h1>
                <h1 className="uppercase text-[80px] font-normal tracking-[-1px] leading-none">
                  Updates
                </h1>
                <h1 className="uppercase text-[80px] font-normal tracking-[-1px] leading-none">
                  Merch
                </h1>
                <h1 className="uppercase text-[80px] font-normal tracking-[-1px] leading-none">
                  Contact
                </h1>
              </div>
              <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                &copy; Designed by Codegrid
              </p>
            </div>
            <div className="flex-[2] flex flex-col justify-between h-full">
              <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                Join the newsletter
                <br />
                <button className="border-none outline-none uppercase text-[12px] font-semibold mt-1 mb-1 px-3 py-1 text-[#0f0f0f] bg-[#dbccc0] rounded-full">
                  Subscribe
                </button>
              </p>
              <div className="relative w-[60%] overflow-hidden">
                <ParallaxImage
                  src="https://lee.hpplus.jp/wp-content/uploads/2025/05/29/87141ec1861c4f3ff2b77dfec9da0df4.jpg"
                  alt=""
                />
              </div>
              <p className="uppercase text-[#191919] text-[14px] font-medium leading-none">
                Spotify / Apple Music / Youtube
              </p>
            </div>
          </section>
          <ParallaxProvider>
            <section className="flex relative gap-4 my-[100px]">
              <div className="text absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 z-50">
                <h1 className="">NEWSLETTERS</h1>
              </div>
              <Marquee>
                <Parallax speed={10}>
                  <img
                    src="/lighter.webp"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="/12.webp"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={3}>
                  <img
                    src="/img-index07.jpg"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={10}>
                  <img
                    src="/img-index10.jpg.webp"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
                <Parallax speed={5}>
                  <img
                    src="/main_3_20.webp"
                    className="w-[480px] h-[700px] object-cover"
                  />
                </Parallax>
              </Marquee>
            </section>
          </ParallaxProvider>
        </div>
      </div>
    </Layout>
  );
}
