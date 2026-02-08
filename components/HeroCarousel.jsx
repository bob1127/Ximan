"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

// 註冊插件
if (typeof window !== "undefined") {
    gsap.registerPlugin(CustomEase);
}

const PickleballAnimation = () => {
  const wrapperRef = useRef(null);
  const carouselImagesRef = useRef(null);
  const textTitleRef = useRef(null);
  const textCategoryRef = useRef(null);
  
  const stateRef = useRef({
    currentIndex: 0,
    isAnimating: false,
    slideOffset: 500,
    autoPlayTimer: null,
  });

  // 1. 修改資料結構：第一頁改為影片，且無文字
  const carouselSlides = [
    { 
        type: "video",
        src: "/images/index/shutterstock_3459837419.mp4",
        title: "", // 不用文字
        category: "" 
    },
    { 
        type: "image",
        src: "/images/Premium_Handbags/LINE_ALBUM_美圖素材20251124_251125_7.jpg",
        title: "Luxury Boutique",
        category: "KÉSH de¹"
    },
    // 您可以繼續新增混合類型的 Slide
  ];

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    // 初始化 CustomEase
    if (!CustomEase.get("hop")) {
        CustomEase.create("hop", "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1");
    }

    function setSlideOffset() {
      stateRef.current.slideOffset = window.innerWidth < 1000 ? 100 : 500;
    }

    // 2. 新增：統一建立媒體元件的 Helper 函式
    function createMediaElement(slideData) {
        let mediaEl;
        if (slideData.type === "video") {
            mediaEl = document.createElement("video");
            mediaEl.src = slideData.src;
            mediaEl.muted = true;
            mediaEl.loop = true;
            mediaEl.autoplay = true;
            mediaEl.playsInline = true; // iOS 必備
            // 確保影片載入後自動播放
            mediaEl.onloadeddata = () => {
                mediaEl.play().catch(e => console.log("Autoplay prevented", e));
            };
        } else {
            mediaEl = document.createElement("img");
            mediaEl.src = slideData.src;
        }

        // 統一統式
        Object.assign(mediaEl.style, {
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            display: "block"
        });
        
        return mediaEl;
    }

    // 初始化第一張 Slide
    function createInitialSlide() {
      if (!carouselImagesRef.current) return;
      carouselImagesRef.current.innerHTML = '';
      
      const initialSlideContainer = document.createElement("div");
      initialSlideContainer.className = "img"; // 保持 class 名稱為 img 以便 CSS 控制
      Object.assign(initialSlideContainer.style, {
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%"
      });

      // 使用 Helper 建立媒體
      const mediaEl = createMediaElement(carouselSlides[0]);
      initialSlideContainer.appendChild(mediaEl);
      
      carouselImagesRef.current.appendChild(initialSlideContainer);

      // 初始化文字 (如果是空的就會顯示空白)
      if(textTitleRef.current && textCategoryRef.current) {
          textTitleRef.current.innerText = carouselSlides[0].title;
          textCategoryRef.current.innerText = carouselSlides[0].category;
      }
    }

    function animateText(index) {
        if(!textTitleRef.current || !textCategoryRef.current) return;

        const title = textTitleRef.current;
        const category = textCategoryRef.current;
        const nextData = carouselSlides[index];

        gsap.to([title, category], {
            y: -50,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                title.innerText = nextData.title;
                category.innerText = nextData.category;

                gsap.set([title, category], { y: 50 });

                // 如果文字是空的，就不執行動畫顯示 (保持隱藏)
                if (nextData.title || nextData.category) {
                    gsap.to([title, category], {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        stagger: 0.1
                    });
                }
            }
        });
    }

    function animateSlide(direction) {
      if (stateRef.current.isAnimating || !carouselImagesRef.current) return;
      stateRef.current.isAnimating = true;
      setSlideOffset();

      animateText(stateRef.current.currentIndex);

      // 3. 修改：抓取當前 Slide 內的圖片 OR 影片
      const currentSlide = carouselImagesRef.current.querySelector(".img:last-child");
      const currentSlideMedia = currentSlide ? currentSlide.querySelector("img, video") : null;

      const newSlideContainer = document.createElement("div");
      newSlideContainer.className = "img";
      Object.assign(newSlideContainer.style, {
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%"
      });

      // 建立新的媒體元件
      const newMediaEl = createMediaElement(carouselSlides[stateRef.current.currentIndex]);
      
      // 設定初始位置 (視差效果)
      gsap.set(newMediaEl, { x: direction === "left" ? -stateRef.current.slideOffset : stateRef.current.slideOffset });

      newSlideContainer.appendChild(newMediaEl);
      carouselImagesRef.current.appendChild(newSlideContainer);

      // 移動當前的媒體 (視差退出)
      if (currentSlideMedia) {
        gsap.to(currentSlideMedia, {
          x: direction === "left" ? stateRef.current.slideOffset : -stateRef.current.slideOffset,
          duration: 1.5,
          ease: "hop",
        });
      }

      // 進場動畫
      gsap.fromTo(
        newSlideContainer,
        { clipPath: direction === "left" ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
          onComplete: () => {
            const slideElements = carouselImagesRef.current.querySelectorAll(".img");
            if (slideElements.length > 1) {
              for (let i = 0; i < slideElements.length - 1; i++) {
                slideElements[i].remove();
              }
            }
            stateRef.current.isAnimating = false;
          },
        }
      );

      // 移動新的媒體歸位 (視差進入)
      gsap.to(newMediaEl, { x: 0, duration: 1.5, ease: "hop" });
    }

    function startAutoPlay() {
      stopAutoPlay();
      stateRef.current.autoPlayTimer = setInterval(() => {
        if (!stateRef.current.isAnimating) {
          stateRef.current.currentIndex = (stateRef.current.currentIndex + 1) % carouselSlides.length;
          animateSlide("right");
        }
      }, 5000);
    }

    function stopAutoPlay() {
      if (stateRef.current.autoPlayTimer) clearInterval(stateRef.current.autoPlayTimer);
    }

    function initCarouselSystem() {
      createInitialSlide();
      setSlideOffset();
      startAutoPlay();
    }

    window.addEventListener("resize", setSlideOffset);
    
    initCarouselSystem();

    return () => {
        window.removeEventListener("resize", setSlideOffset);
        stopAutoPlay();
    };

  }, []);

  // 按鈕邏輯 (鏡像 useEffect 內的邏輯)
  const clickSlide = (direction) => {
    if (stateRef.current.isAnimating) return;
    
    if (direction === "next") {
        stateRef.current.currentIndex = (stateRef.current.currentIndex + 1) % carouselSlides.length;
    } else {
        stateRef.current.currentIndex = (stateRef.current.currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
    }

    if (stateRef.current.autoPlayTimer) clearInterval(stateRef.current.autoPlayTimer);
    
    const wrapper = wrapperRef.current;
    if(!wrapper) return;
    
    // === 文字動畫 (按鈕觸發) ===
    const title = textTitleRef.current;
    const category = textCategoryRef.current;
    const nextData = carouselSlides[stateRef.current.currentIndex];
    
    if(title && category) {
        gsap.to([title, category], {
            y: -50, opacity: 0, duration: 0.5, ease: "power2.in",
            onComplete: () => {
                title.innerText = nextData.title;
                category.innerText = nextData.category;
                gsap.set([title, category], { y: 50 });
                if (nextData.title || nextData.category) {
                    gsap.to([title, category], { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 });
                }
            }
        });
    }
    
    // === 媒體動畫 (按鈕觸發 - 包含 Video 邏輯) ===
    stateRef.current.isAnimating = true;
    const slideOffset = window.innerWidth < 1000 ? 100 : 500;
    const dirStr = direction === "next" ? "right" : "left";
    
    const currentSlide = carouselImagesRef.current.querySelector(".img:last-child");
    const currentSlideMedia = currentSlide ? currentSlide.querySelector("img, video") : null;

    const newSlideContainer = document.createElement("div");
    newSlideContainer.className = "img";
    Object.assign(newSlideContainer.style, { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" });

    // 這裡也要用同樣的邏輯建立媒體
    let newMediaEl;
    const slideData = carouselSlides[stateRef.current.currentIndex];
    if (slideData.type === "video") {
        newMediaEl = document.createElement("video");
        newMediaEl.src = slideData.src;
        newMediaEl.muted = true; newMediaEl.loop = true; newMediaEl.autoplay = true; newMediaEl.playsInline = true;
        newMediaEl.onloadeddata = () => newMediaEl.play().catch(e => {});
    } else {
        newMediaEl = document.createElement("img");
        newMediaEl.src = slideData.src;
    }
    Object.assign(newMediaEl.style, { width: "100%", height: "100%", objectFit: "cover", display: "block" });

    gsap.set(newMediaEl, { x: dirStr === "left" ? -slideOffset : slideOffset });
    newSlideContainer.appendChild(newMediaEl);
    carouselImagesRef.current.appendChild(newSlideContainer);

    if (currentSlideMedia) {
        gsap.to(currentSlideMedia, {
            x: dirStr === "left" ? slideOffset : -slideOffset,
            duration: 1.5,
            ease: "hop",
        });
    }

    gsap.fromTo(newSlideContainer,
        { clipPath: dirStr === "left" ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
        {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.5,
            ease: "hop",
            onComplete: () => {
                const slideElements = carouselImagesRef.current.querySelectorAll(".img");
                if (slideElements.length > 1) {
                    for (let i = 0; i < slideElements.length - 1; i++) slideElements[i].remove();
                }
                stateRef.current.isAnimating = false;
                stateRef.current.autoPlayTimer = setInterval(() => {
                    if (!stateRef.current.isAnimating) {
                        // AutoPlay Logic
                    }
                }, 5000);
            },
        }
    );
    gsap.to(newMediaEl, { x: 0, duration: 1.5, ease: "hop" });
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
      `}</style>
      
      <style jsx>{`
        #integrated-wrapper {
          font-family: "Inter", sans-serif;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background-color: #000;
        }

        .lacrapule-wrapper {
            font-family: "DM Sans", sans-serif;
            background-color: #000;
            color: #fff;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            z-index: 1;
        }

        .carousel {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .carousel-images {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8; /* 影片通常比較亮，可以稍微調低透明度 */
        }

        .slide-info {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            text-align: center;
            width: 80%;
            pointer-events: none;
            overflow: hidden;
        }

        .slide-info p {
            font-size: 1rem;
            letter-spacing: 0.2rem;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1rem;
            font-weight: 500;
        }

        .slide-info h1 {
            font-size: 4rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #fff;
            line-height: 1.1;
        }

        @media (max-width: 768px) {
            .slide-info h1 { font-size: 2.5rem; }
        }

        .slider-controls {
            position: absolute;
            width: 95%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 0 5%;
            display: flex;
            justify-content: space-between;
            z-index: 30;
            pointer-events: none;
        }
        
        .control-btn {
            pointer-events: auto;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255,255,255,0.1);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%; 
            cursor: pointer;
            transition: all 300ms ease;
        }

        .control-btn:hover { 
            background-color: #fff; 
            transform: scale(1.1);
        }
        
        .control-btn svg { 
            width: 2rem; 
            height: 2rem; 
            stroke: #fff; 
            fill: #fff; 
            transition: fill 200ms ease-in-out; 
        }
        .control-btn:hover svg { fill: #000; stroke: #000; }

        .lacrapule-wrapper footer {
            position: absolute;
            width: 100%;
            padding: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            z-index: 20;
            bottom: 0;
            left: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }

        @media (max-width: 900px) {
            .slider-controls {
                width: 100%;
                top: auto;
                bottom: 5rem;
                transform: translate(-50%, 0);
                justify-content: center;
                gap: 2rem;
            }
        }
      `}</style>

      <div id="integrated-wrapper" ref={wrapperRef}>
        <div className="lacrapule-wrapper">
            <div className="carousel">
                <div className="carousel-images" ref={carouselImagesRef}></div>
            </div>

            <div className="slide-info">
                <p ref={textCategoryRef}></p>
                <h1 ref={textTitleRef}></h1>
            </div>

            <div className="slider-controls">
                <button className="control-btn prev-btn" onClick={() => clickSlide("prev")}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                </button>
                <button className="control-btn next-btn" onClick={() => clickSlide("next")}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
                </button>
            </div>

            <footer>
                <p>KESH LUXURY CO., LTD </p>
                <p>Brand Philosophy</p>
            </footer>
        </div>
      </div>
    </>
  );
};

export default PickleballAnimation;