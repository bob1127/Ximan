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
    gsap.to(dragIndicatorRef.current, { opacity: 1, scale: 1, duration: 0.5 });
    document.body.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    gsap.to(dragIndicatorRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
    });
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi
      .on("reInit", () => {})
      .on("scroll", () => {})
      .on("slideFocus", () => {});
  }, [emblaApi]);

  return (
    <div
      className="w-full py-8 mx-auto relative"
      style={{
        "--slide-height": "4rem",
        "--slide-spacing": "1rem",
        "--slide-size": "21%", // Default value for larger screens
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>
        {`
      @media (max-width: 1700px) {
        .embla__viewport {
          --slide-size: 32%;
        }
      }
      @media (max-width: 1000px) {
        .embla__viewport {
          --slide-size: 36%;
        }
      }
      @media (max-width: 550px) {
        .embla__viewport {
          --slide-size: 80%;
        }
      }
    `}
      </style>
      <div className="embla__controls absolute   left-1/2 -translate-x-1/2 justify-between flex  bottom-[0%] gap-3 mt-7">
        <div className="embla__buttons absolute left-[-50%] -translate-x-1/2 top-8 flex justify-between  w-[180px] justify-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
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
      {/* ✅ 一開始整體靠右：靠 paddingLeft 往右推整排卡片 */}
      <div
        className="embla__viewport "
        ref={emblaRef}
        style={{ paddingLeft: "24rem" }} // 這個數字決定「靠右」的程度
      >
        <div
          className="embla__container  flex touch-pan-y touch-pinch-zoom h-auto"
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
              <div
                className="embla__slide__number bg-[#f7f7f7] group pt-0 pb-[35px] flex flex-col items-center justify-center"
                style={{
                  boxShadow: "inset 0 0 0 0.2rem var(--detail-medium-contrast)",

                  fontSize: "4rem",
                  height: "100%",
                  userSelect: "none",
                }}
              >
                <a href="/" className="">
                  <div className="flex flex-col justify-center items-center">
                    <div>
                      <span className="card-title text-[1.2rem]">
                        Product-Name
                      </span>
                    </div>

                    {slide.content ? (
                      slide.content
                    ) : (
                      <div className="w-full p-8 aspect-square relative overflow-hidden">
                        <Image
                          width={1800}
                          height={800}
                          placeholder="empty"
                          loading="lazy"
                          src={slide.image}
                          className="w-full scale-100 group-hover:scale-105 duration-400 h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="txt mt-5 flex-col flex justify-center items-center w-4/5 mx-auto">
                      <b className="text-[16px] text-center">{slide.title}</b>
                      <p className="text-[14px] font-normal text-center">
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
      {/* ✅ 控制區：左右箭頭 + dots，一樣可用 */}
    </div>
  );
};

export default EmblaCarousel;
