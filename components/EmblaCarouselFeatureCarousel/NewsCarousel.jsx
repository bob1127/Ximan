"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../EmblaCarouselFeatureCarousel/EmblaCarouselArrowButtons";
import {
  DotButton,
  useDotButton,
} from "../EmblaCarouselFeatureCarousel/EmblaCarosuelDotButton";
import Image from "next/image";

const newsItems = [
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/20251111_12_bororo7847-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-stone-800",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[33vh] group-hover:h-[40vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/Insta_26SS_JOINT_m2028-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-white",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[36vh] group-hover:h-[44vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/20250924_25_bororo4741-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-white",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[26vh] group-hover:h-[33vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/Insta_JOINT_k9591-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-white",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[30vh] group-hover:h-[35vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/20250924_25_bororo4741-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-stone-800",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[33vh] group-hover:h-[40vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/11/himie_main4%C3%975-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-white",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[36vh] group-hover:h-[44vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/10/IMG_1445-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-white",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[26vh] group-hover:h-[33vh]",
  },
  {
    img: "https://culet-web.jp/2018/wp/wp-content/uploads/2025/10/IMG_1446-scaled.jpg",
    title: "「A&D Awards 2024」受賞",
    titleColor: "text-white",
    body: "太陽印刷製造 InnoValley 在最佳工作場所類別中獲得了最高獎項。",
    placeDate: "Taichung - 2025.03.23",
    imgWrapperClass: "h-auto md:h-[30vh] group-hover:h-[35vh]",
  },
];

const NewsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="embla-news relative mt-6">
      {/* viewport */}
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="
                embla__slide
                flex-[0_0_90%]
                sm:flex-[0_0_60%]
                md:flex-[0_0_40%]
                xl:flex-[0_0_25%]
                px-2
              "
            >
              <div className="w-full mx-auto md:w-[200px] lg:w-[230px] 2xl:w-[280px] xl:w-[230px] group">
                <div
                  className={`img mx-auto overflow-hidden transition-all duration-500 ${item.imgWrapperClass}`}
                >
                  <div className="animate-image-wrapper mx-auto relative w-full aspect-[4/5] md:h-full overflow-hidden ">
                    <div className="image-container relative w-full h-full">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-[1.05] duration-700"
                        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 550px, 85vw"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col px-3 py-4">
                  <div className="inline-block pb-4">
                    <button
                      type="button"
                      className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-100 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:after:origin-bottom-left group-hover:after:scale-x-100"
                    >
                      <b
                        className={`text-[.9rem] font-bold ${item.titleColor}`}
                      >
                        {item.title}
                      </b>
                    </button>
                  </div>
                  <span className="text-[.75rem] text-gray-100">
                    {item.body}
                  </span>
                  <span className="text-[.75rem] text-gray-100">
                    {item.placeDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 控制區：左右箭頭 + dots */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-3">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="flex gap-2">
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
    </div>
  );
};

export default NewsCarousel;
