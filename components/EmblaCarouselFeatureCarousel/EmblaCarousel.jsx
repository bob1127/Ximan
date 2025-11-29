import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarosuelDotButton";
import { gsap } from "gsap";
import Image from "next/image";

const EmblaCarousel = (props) => {
  const { slides, options } = props;

  // ✅ 強制關閉 loop，避免無限輪播
  const mergedOptions = {
    ...options,
    loop: false,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(mergedOptions);
  const dragIndicatorRef = useRef(null);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const handleMouseEnter = () => {
    // 只有在存在 ref 時才執行動畫，避免報錯
    if (dragIndicatorRef.current) {
      gsap.to(dragIndicatorRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
      });
    }
    document.body.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    if (dragIndicatorRef.current) {
      gsap.to(dragIndicatorRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
      });
    }
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    if (!emblaApi) return;
    // 這裡可以加入其他的 Embla 事件監聽
  }, [emblaApi]);

  return (
    <div
      className="w-full py-8 mx-auto relative group/carousel"
      style={{
        "--slide-height": "4rem",
        "--slide-spacing": "1rem",
        // 預設 (手機版) 變數，會在下方 style 標籤被覆寫
        "--slide-size": "85%",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>
        {`
          /* Mobile First 策略：預設是手機樣式，針對大螢幕做覆寫 */
          .embla__viewport {
            --slide-size: 85%; /* 手機版：單張寬度佔 85%，露出下一張一點點 */
          }
          
          /* 平板 (md) */
          @media (min-width: 768px) {
            .embla__viewport {
              --slide-size: 45%; /* 平板：一排約 2 張 */
            }
          }

          /* 小筆電 / 桌機 (lg) */
          @media (min-width: 1024px) {
            .embla__viewport {
              --slide-size: 30%; /* 桌機：一排約 3 張 */
            }
          }

          /* 超大螢幕 (2xl) - 維持你原本的設定 */
          @media (min-width: 1600px) {
            .embla__viewport {
              --slide-size: 21%; /* 大螢幕：一排約 5 張 */
            }
          }
        `}
      </style>

      {/* ✅ 控制區：按鈕與圓點 */}
      {/* 修改：手機版相對定位並置中，大螢幕維持絕對定位 */}
      <div className="embla__controls flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 mt-6 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-[0%] z-10 w-full px-4 md:px-0">
        {/* 箭頭按鈕區塊 */}
        {/* 修改：大螢幕使用 absolute 定位維持原本設計 (left-[-50%])，手機版改為 static 讓它自然排列 */}
        <div className="embla__buttons flex justify-center w-[140px] md:w-[180px] gap-4 md:gap-0 md:absolute md:left-[-50%] md:-translate-x-1/2 md:top-8">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        {/* 圓點區塊 */}
        <div className="embla__dots flex flex-wrap justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>

      {/* ✅ Viewport 區域 */}
      {/* 重點修改：
          1. pl-4: 手機版給一點點左邊距，不要貼死。
          2. lg:pl-[24rem]: 只有在大螢幕 (lg以上) 才套用 24rem 的大位移。
      */}
      <div
        className="embla__viewport pl-4 md:pl-10 lg:pl-[24rem] overflow-hidden"
        ref={emblaRef}
      >
        <div
          className="embla__container flex touch-pan-y touch-pinch-zoom h-auto"
          style={{ marginLeft: "calc(var(--slide-spacing) * -1)" }}
        >
          {slides.map((slide, index) => (
            <div
              className="embla__slide relative transform flex-none h-full min-w-0"
              key={index}
              style={{
                transform: "translate3d(0, 0, 0)",
                flex: "0 0 var(--slide-size)",
                paddingLeft: "var(--slide-spacing)",
              }}
            >
              {/* 卡片本體 */}
              <div
                className="embla__slide__number bg-[#f7f7f7] group pb-[25px] md:pb-[35px] flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg"
                style={{
                  boxShadow: "inset 0 0 0 0.2rem var(--detail-medium-contrast)",
                  height: "100%",
                  userSelect: "none",
                }}
              >
                <a href="/" className="w-full h-full block">
                  <div className="flex flex-col justify-center items-center h-full">
                    {/* 產品名稱標籤 */}
                    <div className="py-4">
                      <span className="card-title text-[1rem] md:text-[1.2rem] font-medium tracking-wide">
                        Product-Name
                      </span>
                    </div>

                    {/* 圖片區域 */}
                    {slide.content ? (
                      slide.content
                    ) : (
                      <div className="w-full px-6 md:px-8 aspect-square relative overflow-hidden">
                        <Image
                          width={800} // 優化：不用讀取太大的圖
                          height={800}
                          placeholder="empty"
                          loading="lazy"
                          src={slide.image}
                          alt={slide.title || "Product Image"}
                          className="w-full h-full object-cover scale-100 group-hover:scale-105 duration-500 ease-out"
                        />
                      </div>
                    )}

                    {/* 文字區域 */}
                    <div className="txt mt-4 md:mt-5 flex-col flex justify-center items-center w-[90%] md:w-4/5 mx-auto">
                      <b className="text-[14px] md:text-[16px] text-center leading-tight mb-2">
                        {slide.title}
                      </b>
                      <p className="text-[12px] md:text-[14px] font-normal text-center text-gray-600 line-clamp-2">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
