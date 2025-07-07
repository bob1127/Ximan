"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const team = [
  {
    name: "Ava Sinclair",
    role: "Creative Director",
    bg: "bg-white",
    img: "/img-index10.jpg.webp",
  },
  {
    name: "Liam Archer",
    role: "Brand Strategist",
    bg: "bg-white",
    img: "/Hirotaka1.jpeg",
  },
  {
    name: "Zoe Clementine",
    role: "Lead Designer",
    bg: "bg-white",
    img: "/img-index05.jpg.webp",
  },
  {
    name: "Ethan Hawthorne",
    role: "Chief Innovation Officer",
    bg: "bg-white",
    img: "/12.webp",
  },
];

export default function TeamPage() {
  const cursorRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  const updateCursor = (e) => {
    const cursor = cursorRef.current;
    const half = window.innerWidth / 2;
    const icon = cursor.querySelector("i");

    gsap.to(cursor, {
      x: e.clientX - 15,
      y: e.clientY - 15,
      duration: 0.8,
      ease: "power3.out",
    });

    if (e.clientX > half && currentSlide < team.length) {
      icon.classList.remove("ph-arrow-left");
      icon.classList.add("ph-arrow-right");
      cursor.style.display = "block";
    } else if (e.clientX < half && currentSlide > 1) {
      icon.classList.remove("ph-arrow-right");
      icon.classList.add("ph-arrow-left");
      cursor.style.display = "block";
    } else {
      cursor.style.display = "none";
    }
  };

  const animateSlide = (index, reveal) => {
    const marquee = document.querySelector(`.marquee-wrapper.t-${index}`);
    const img = document.getElementById(`t-${index}`);
    const clip = reveal
      ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
      : "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)";

    gsap.to(marquee, {
      clipPath: clip,
      duration: 1.4,
      ease: "power4.inOut",
      delay: 0.2,
    });
    gsap.to(img, {
      clipPath: clip,
      duration: 1.4,
      ease: "power4.inOut",
      scale: reveal ? 1.05 : 1,
      opacity: reveal ? 1 : 0.8,
    });
  };

  const goNext = () => {
    if (currentSlide < team.length) {
      animateSlide(currentSlide + 1, true);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 1) {
      animateSlide(currentSlide, false);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleHover = (el) => {
    gsap.to(el, { scale: 1.2, duration: 0.3, ease: "power2.out" });
  };

  const handleLeave = (el) => {
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  useEffect(() => {
    document.addEventListener("mousemove", updateCursor);
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("keydown", handleKey);
    };
  }, [currentSlide]);

  const currentMember = team[currentSlide - 1];

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between z-20">
        <p className="text-lg font-semibold">Vertex Studio</p>
        <p className="text-lg font-semibold">Showreel</p>
      </nav>

      {/* Background Marquees */}
      <div className="absolute top-0 left-0 w-full h-full">
        {team.map((member, i) => (
          <div
            key={i}
            className={`marquee-wrapper t-${i + 1} ${
              member.bg
            } absolute top-0 left-0 w-full h-full overflow-hidden`}
            style={{
              clipPath:
                i === 0
                  ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
                  : "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
            }}
          >
            <h1 className="absolute top-1/2 left-[-100%] transform -translate-y-1/2 text-[240px] whitespace-nowrap uppercase font-normal w-full text-center animate-marquee">
              {Array(3).fill(member.name).join(" ")}
            </h1>
          </div>
        ))}
      </div>

      {/* Image + Info Block */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[700px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-full h-[600px]">
          {team.map((member, i) => (
            <div
              key={i}
              id={`t-${i + 1}`}
              className="absolute w-full h-full"
              style={{
                clipPath:
                  i === 0
                    ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
                    : "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
              }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold">{currentMember.name}</p>
          <p className="text-base text-gray-600 mt-1">{currentMember.role}</p>
        </div>
      </div>

      {/* Arrow Buttons */}
      <div className="absolute top-1/2 left-8 z-50 -translate-y-1/2">
        <button
          onClick={goPrev}
          onMouseEnter={(e) => handleHover(e.currentTarget)}
          onMouseLeave={(e) => handleLeave(e.currentTarget)}
          className="text-3xl text-black bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-8 z-50 -translate-y-1/2">
        <button
          onClick={goNext}
          onMouseEnter={(e) => handleHover(e.currentTarget)}
          onMouseLeave={(e) => handleLeave(e.currentTarget)}
          className="text-3xl text-black bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          →
        </button>
      </div>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="cursor fixed top-0 left-0 text-2xl z-[1000] hidden pointer-events-none"
      >
        <i className="ph-light ph-arrow-left"></i>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translate(0%, -50%);
          }
          50% {
            transform: translate(-5%, -50%);
          }
          50.5% {
            transform: translate(-5%, -50%);
          }
          100% {
            transform: translate(0%, -50%);
          }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
