"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

const Photos = () => {
  const sliderRef = useRef(null);
  const sliderImagesRef = useRef(null);
  const counterRef = useRef(null);
  const titlesRef = useRef(null);
  const indicatorsRef = useRef(null);
  const previewsRef = useRef([]);

  // 1. 定義圖片路徑
  const imagePaths = [
     "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_10.jpg",
    

    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_3.jpg",
   "/images/Premium_Handbags/shutterstock_2618316423.jpg",
    "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251124_21.jpg",
  ];

  // 2. 定義標題
  const titles = ["最新現貨 New In", "商品代購", "Hermès 專區", "高價收購"];

  // 3. 定義簡短描述
  const descriptions = [
    "嚴選國際精品｜當季新品代購｜專業鑑定｜正品保證｜全球配送",
    "嚴選國際精品｜當季新品代購｜專業鑑定｜正品保證｜全球配送",
       "嚴選國際精品｜當季新品代購｜專業鑑定｜正品保證｜全球配送",
    "嚴選國際精品｜當季新品代購｜專業鑑定｜正品保證｜全球配送",
  ];

  useGSAP(
    () => {
      const hop2 = CustomEase.create(
        "hop2",
        "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
      );

      let currentImg = 1;
      const totalSlides = imagePaths.length;
      let indicatorRotation = 0;
      let autoSlideTimer = null; // 定義計時器變數

      if (previewsRef.current[0]) {
        previewsRef.current[0].classList.add("active");
      }

      function updateCounterAndTitlePosition() {
        const counterHeight = 24;
        const counterY = -counterHeight * (currentImg - 1);

        // 自動抓取 Title 區塊的實際高度
        let titleHeight = 180;
        if (titlesRef.current && titlesRef.current.children.length > 0) {
          titleHeight = titlesRef.current.children[0].offsetHeight;
        }

        const titleY = -titleHeight * (currentImg - 1);

        if (counterRef.current) {
          gsap.to(counterRef.current, {
            y: counterY,
            duration: 1,
            ease: "hop2",
          });
        }

        if (titlesRef.current) {
          gsap.to(titlesRef.current, {
            y: titleY,
            duration: 1,
            ease: "hop2",
          });
        }
      }

      function updateActiveSlidePreview() {
        previewsRef.current.forEach((prev) => {
          if (prev) prev.classList.remove("active");
        });
        if (previewsRef.current[currentImg - 1]) {
          previewsRef.current[currentImg - 1].classList.add("active");
        }
      }

      function animateSlide(direction) {
        const currentSlide = sliderImagesRef.current.lastElementChild;

        const slideImg = document.createElement("div");
        slideImg.classList.add("img");

        const slideImgElem = document.createElement("img");
        slideImgElem.src = imagePaths[currentImg - 1];
        gsap.set(slideImgElem, { x: direction === "left" ? -500 : 500 });

        slideImg.appendChild(slideImgElem);
        sliderImagesRef.current.appendChild(slideImg);

        const tl = gsap.timeline();

        tl.to(currentSlide.querySelector("img"), {
          x: direction === "left" ? 500 : -500,
          duration: 1.5,
          ease: "hop2",
        })
          .fromTo(
            slideImg,
            {
              clipPath:
                direction === "left"
                  ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                  : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "hop2",
            },
            0
          )
          .to(
            slideImgElem,
            {
              x: 0,
              duration: 1.5,
              ease: "hop2",
            },
            0
          )
          .call(() => cleanupSlides(), null, 1.5);

        if (indicatorsRef.current && indicatorsRef.current.children) {
          indicatorRotation += direction === "left" ? -90 : 90;
          gsap.to(indicatorsRef.current.children, {
            rotate: indicatorRotation,
            duration: 1,
            ease: "hop2",
          });
        }
      }

      function cleanupSlides() {
        const imgElements = sliderImagesRef.current.querySelectorAll(".img");
        if (imgElements.length > totalSlides) {
          if (imgElements.length > 2) {
            gsap.to(imgElements[0], {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                imgElements[0].remove();
              },
            });
          }
        }
      }

      function nextSlide() {
        currentImg = currentImg < totalSlides ? currentImg + 1 : 1;
        animateSlide("right");
        updateActiveSlidePreview();
        updateCounterAndTitlePosition();
      }

      // --- 自動輪播控制函式 ---
      function startAutoSlide() {
        // 先清除舊的，避免重複疊加
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        // 設定 4000ms (4秒) 切換一次
        autoSlideTimer = setInterval(() => {
          nextSlide();
        }, 4000);
      }

      // 啟動自動輪播
      startAutoSlide();

      function handleClick(event) {
        if (!sliderRef.current) return;

        // 當使用者有互動時，重置自動輪播計時器，避免使用者剛點完馬上又跳轉
        startAutoSlide();

        const sliderWidth = sliderRef.current.clientWidth;
        const clickPosition = event.clientX;

        // 避免點擊到按鈕時觸發換頁
        if (event.target.closest(".shop-btn")) {
          return;
        }

        if (event.target.closest(".slider-preview")) {
          const clickedPrev = event.target.closest(".preview");
          if (clickedPrev) {
            const clickedIndex = previewsRef.current.indexOf(clickedPrev) + 1;
            if (clickedIndex !== currentImg && clickedIndex > 0) {
              const direction = clickedIndex < currentImg ? "left" : "right";
              currentImg = clickedIndex;
              animateSlide(direction);
              updateActiveSlidePreview();
              updateCounterAndTitlePosition();
            }
          }
          return;
        }

        if (clickPosition < sliderWidth / 2 && currentImg !== 1) {
          currentImg--;
          animateSlide("left");
        } else if (
          clickPosition > sliderWidth / 2 &&
          currentImg !== totalSlides
        ) {
          currentImg++;
          animateSlide("right");
        }

        updateActiveSlidePreview();
        updateCounterAndTitlePosition();
      }

      const sliderEl = sliderRef.current;
      sliderEl.addEventListener("click", handleClick);

      return () => {
        sliderEl.removeEventListener("click", handleClick);
        // 清除計時器，避免 Memory Leak
        if (autoSlideTimer) clearInterval(autoSlideTimer);
      };
    },
    { scope: sliderRef }
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --text: #fff;
        }
        .slider {
          position: relative;
          width: 100%;
          overflow: hidden;
          height: 100vh;
        }
        @media (max-width: 1200px) {
          .slider {
            height: 85vh;
          }
        }
        @media (max-width: 1000px) {
          .slider {
            height: 80vh;
          }
        }
        @media (max-width: 768px) {
          .slider {
            height: 75vh;
          }
        }
        @media (max-width: 480px) {
          .slider {
            height: 70vh;
          }
        }

        .slider-images,
        .slider .img {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        .slider .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slider-counter {
          position: absolute;
          bottom: 2em;
          left: 50%;
          transform: translateX(-50%);
          height: 24px;
          overflow: hidden;
          display: flex;
          gap: 0.5em;
          z-index: 10;
        }
        .slider .counter {
          display: flex;
          flex-direction: column;
          line-height: 24px;
        }
        .slider-counter p {
          font-size: 20px;
          line-height: 24px;
          color: var(--text);
          margin: 0;
        }

        /* --- 主要內容區塊 --- */
        .slider-title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 180px; /* 桌機高度 */
          overflow: hidden;
          z-index: 10;
          pointer-events: none;
        }

        .slider-title-wrapper {
          position: relative;
          width: 100%;
          text-align: center;
          pointer-events: auto;
        }

        /* 單個文字群組設定 */
        .text-group {
          height: 180px; /* 桌機高度 (與上方一致) */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }

        .text-group h2 {
          font-size: 48px;
          color: white;
          font-weight: 300;
          margin: 0;
          line-height: 1.2;
          letter-spacing: 1px;
        }

        .text-group p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .shop-btn {
          margin-top: 10px;
          padding: 10px 30px;
          background: transparent;
          border: 1px solid white;
          color: white;
          font-size: 14px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .shop-btn:hover {
          background: white;
          color: black;
        }

        /* 手機版設定 (小於 900px) */
        @media (max-width: 900px) {
          .slider-title {
            height: 240px; /* 稍微再加高一點，避免斷行內容被切掉 */
          }
          .text-group {
            height: 240px; /* 必須與 .slider-title 一致 */
          }
          .text-group h2 {
            font-size: 32px;
          }
          .text-group p {
            font-size: 14px;
            max-width: 80%;
            line-height: 1.4;
          }
        }

        .slider-indicators {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75%;
          display: flex;
          justify-content: space-between;
          z-index: 10;
          pointer-events: none;
        }
        .slider-indicators p {
          font-size: 40px;
          color: var(--text);
          margin: 0;
        }

        .slider-preview {
          position: absolute;
          bottom: 2em;
          right: 2em;
          width: 300px;
          height: 50px;
          display: flex;
          gap: 0.5em;
          z-index: 20;
        }
        .slider .preview {
          position: relative;
          flex: 1;
          cursor: pointer;
          overflow: hidden;
        }
        .slider .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .slider .preview::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          transition: 0.3s ease-in-out;
        }
        .slider .preview.active::after {
          background-color: rgba(0, 0, 0, 0);
        }
        @media (max-width: 900px) {
          .slider-indicators {
            width: 90%;
          }
          .slider-preview {
            width: 90%;
            bottom: 5em;
            right: 5%;
          }
        }
      `}</style>

      <div className="slider" ref={sliderRef}>
        <div className="slider-images" ref={sliderImagesRef}>
          <div className="img">
            <img src={imagePaths[0]} alt="slide-1" />
          </div>
        </div>

        <div className="slider-title">
          <div className="slider-title-wrapper" ref={titlesRef}>
            {titles.map((title, index) => (
              <div className="text-group" key={index}>
                <h2>{title}</h2>
                <p>{descriptions[index]}</p>
                <button
                  className="shop-btn "
                  onClick={() => alert(`前往購買: ${title}`)}
                >
                 More
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-counter">
          <div className="counter" ref={counterRef}>
            {imagePaths.map((_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>
          <div className="total">
            <p>—</p>
          </div>
          <div className="total">
            <p>{imagePaths.length}</p>
          </div>
        </div>

        <div className="slider-indicators" ref={indicatorsRef}>
          <div>
            <p>+</p>
          </div>
          <div>
            <p>+</p>
          </div>
        </div>

        <div
          className="slider-preview"
          ref={previewsRef.current ? null : previewsRef}
        >
          {imagePaths.map((path, idx) => (
            <div
              className="preview"
              key={idx}
              ref={(el) => (previewsRef.current[idx] = el)}
            >
              <img src={path} alt={`preview-${idx}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Photos;
