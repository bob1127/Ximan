"use client";
import React, { useState, useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion } from "framer-motion";

// --- 資料結構：方便維護內容 ---
const sections = [
  {
    id: "shopping-notes",
    title: "購物須知",
    enTitle: "Shopping Notes",
    content: (
      <div className="space-y-4">
        <p>
          歡迎您來到 KÉSH de¹
          凱仕國際精品。為了確保雙方的權益，請您在購買前詳細閱讀以下須知。當您進行結帳或付款時，即視為您已同意本站之所有條款。
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>
            KÉSH de¹
            所有商品均為實品拍攝，因顯示器不同可能產生些微色差，請以實品顏色為準。
          </li>
          <li>商品尺寸皆為人工測量，可能存在 1-2cm 之誤差，屬正常範圍。</li>
          <li>
            訂單成立後，請於 <strong>24 小時內</strong>{" "}
            完成付款，逾時系統將自動取消訂單。
          </li>
          <li>
            我們提供國內宅配與店面自取服務，確認款項後將於 1-3 個工作天內出貨。
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "authenticity",
    title: "正品保證條款",
    enTitle: "Authenticity",
    content: (
      <div className="space-y-4">
        <p className="font-medium text-black">KÉSH de¹ 承諾僅販售 100% 正品。</p>
        <p>
          我們擁有專業的鑑定團隊，並配合第三方權威機構（如
          Entrupy）進行雙重驗證。
          若您購買的商品經由兩家以上具公信力之第三方鑑定機構（需提供書面報告）證實為非正品，
          <strong>我們承諾全額退款，並負擔相關檢驗費用。</strong>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          * 為了保障您的權益，請保留完整購買憑證與商品配件。
        </p>
      </div>
    ),
  },
  {
    id: "grading",
    title: "商品品況分級",
    enTitle: "Condition Standards",
    content: (
      <div className="space-y-6">
        <p>
          由於二手精品的特殊性，我們制定了嚴格的品況分級標準，讓您能更精準地掌握商品狀態：
        </p>

        <div className="grid gap-4">
          {[
            {
              rank: "S",
              label: "未使用新品 / Unused",
              desc: "全新未使用，包含完整包裝與配件，適合作為禮物。",
            },
            {
              rank: "A",
              label: "極新品 / Mint",
              desc: "幾乎看不出使用痕跡，整體狀態極佳，僅有些微存放痕跡。",
            },
            {
              rank: "AB",
              label: "保存良好 / Excellent",
              desc: "有輕微使用感（如五金細紋、邊角極輕微磨損），但整體外觀仍相當漂亮。",
            },
            {
              rank: "B",
              label: "有使用感 / Good",
              desc: "有明顯的使用痕跡、刮傷或變色，但不影響正常使用，反映在價格上更具優勢。",
            },
          ].map((grade) => (
            <div
              key={grade.rank}
              className="flex items-start p-4 bg-gray-50 rounded-sm border border-gray-100"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-black text-white font-serif text-xl mr-4">
                {grade.rank}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{grade.label}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {grade.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "return-policy",
    title: "退換貨政策",
    enTitle: "Return Policy",
    content: (
      <div className="space-y-4">
        <p>
          根據台灣消費者保護法規定，二手商品（非企業經營者大量製造販售之全新品）
          <strong>不適用於七天鑑賞期無條件退貨</strong>。
        </p>
        <p>但若發生以下情況，我們將無條件接受退貨：</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>商品經第三方鑑定證實為非正品（參見正品保證條款）。</li>
          <li>
            收到的商品與網站描述、照片有重大出入（如：標示為 S
            級卻有明顯破損）。
          </li>
        </ul>
        <p className="mt-4 text-gray-500 text-sm">
          * 若因個人因素（如：不喜歡、尺寸不合、色差）欲退換貨，請於收到商品 24
          小時內聯繫客服，我們將協助您改為「寄賣」形式處理。
        </p>
      </div>
    ),
  },
  {
    id: "privacy",
    title: "隱私權政策",
    enTitle: "Privacy Policy",
    content: (
      <div className="space-y-4 text-sm text-gray-500">
        <p>
          KÉSH de¹
          非常重視您的隱私權。我們所收集的個人資料（如姓名、電話、地址、Email）
          僅用於訂單處理、物流配送與會員服務，絕不會將您的資料洩漏、販售或提供給無關之第三方。
        </p>
        <p>
          本網站採用 SSL 加密技術保護您的交易安全，您可以安心在 KÉSH de¹
          進行購物。
        </p>
      </div>
    ),
  },
  {
    id: "terms",
    title: "服務條款",
    enTitle: "Terms of Service",
    content: (
      <div className="space-y-4 text-sm text-gray-500">
        <p>
          使用本網站服務即表示您同意本條款。KÉSH de¹
          保留隨時修改本條款之權利，修改後的條款將公佈於網站上，不另行個別通知。
        </p>
        <p>
          若您未滿 20 歲，請由法定代理人陪同閱讀本條款，方可使用本網站服務。
        </p>
      </div>
    ),
  },
];

export default function ShoppingGuide() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  // 點擊滾動功能
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // 扣除 header 高度 (假設 100px)
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // 監聽滾動以更新目前 Active 的項目 (簡單版)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // 偏移量

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ReactLenis root>
      <div className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* 左側：黏性目錄 (Sticky Sidebar) */}
          <aside className="md:col-span-3 md:sticky md:top-32 md:h-[calc(100vh-8rem)] hidden md:block">
            <h1 className="text-2xl font-serif font-medium mb-2">
              Shopping Guide
            </h1>
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">
              Please read before buying
            </p>

            <nav className="space-y-4 border-l border-gray-100">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block text-left pl-4 py-1 text-sm transition-all duration-300 border-l-2 -ml-[2px] ${
                    activeSection === section.id
                      ? "border-black text-black font-medium"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className="block">{section.title}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    {section.enTitle}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* 手機版標題 (只在小螢幕出現) */}
          <div className="md:hidden mb-8">
            <h1 className="text-3xl font-serif text-center mb-2">
              Shopping Guide
            </h1>
            <p className="text-center text-xs text-gray-400 tracking-widest uppercase">
              購物須知與服務條款
            </p>
          </div>

          {/* 右側：內容區塊 */}
          <main className="md:col-span-9 space-y-20 md:pl-10">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-mt-32 border-b border-gray-100 pb-16 last:border-0"
              >
                <div className="flex items-baseline mb-6">
                  <span className="text-xs font-bold text-gray-300 mr-4">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-serif text-gray-900">
                    {section.title}
                  </h2>
                </div>

                <div className="text-gray-600 font-light leading-loose text-justify pl-8 md:pl-10">
                  {section.content}
                </div>
              </motion.section>
            ))}

            {/* 頁尾小語 */}
            <div className="pt-8 text-center">
              <p className="text-sm text-gray-400 italic font-serif">
                Thank you for choosing kesh-de1
              </p>
            </div>
          </main>
        </div>
      </div>
    </ReactLenis>
  );
}
