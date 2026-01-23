"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";
import Link from "next/link";

// --- 資料結構 (將您的文案轉化為結構化數據) ---
const faqData = [
  {
    category: "一、購買與訂單相關 (Shopping & Orders)",
    items: [
      {
        q: "Q1：你們的商品都是正品嗎？",
        a: (
          <div className="space-y-2">
            <p>是的。KÉSH 僅販售來源嚴格良好的精品，並由專業鑑定師結合國際級鑑定設備進行多重驗證，為您把關每一件商品的真實與品質，100% 正品保障。</p>
            <p>所有商品於上架前皆完成完整鑑定流程，包含：</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>皮革紋路與老化狀況</li>
              <li>五金刻印與材質檢查</li>
              <li>車縫線距與結構檢視</li>
              <li>標籤字體、刻印與年份編碼</li>
            </ul>
            <p>我們並搭配實拍照片與影片完整呈現。</p>
          </div>
        ),
      },
      {
        q: "Q2：購買後可以退換貨嗎？",
        a: "二手精品具唯一性，售出後恕不退換。我們會於上架時完整揭露商品品況，並於出貨前再次拍照與錄影存檔，確保雙方權益。",
      },
      {
        q: "Q3：下單後可以取消訂單嗎？",
        a: (
          <div>
            <p>如需取消訂單，請於下單後 12 小時內聯繫客服申請。為避免衝動消費，建議貴賓下單前再次確認購買意願。</p>
            <Link href="/contact" className="inline-flex items-center gap-1 mt-2 text-[#ef4628] font-bold border-b border-[#ef4628] pb-0.5 hover:opacity-80">
              聯繫客服 <MessageCircle size={14} />
            </Link>
          </div>
        ),
      },
      {
        q: "Q4：購買會提供發票或收據嗎？",
        a: "會的。所有交易皆依法開立二聯式紙本或雲端發票，可於結帳時自由選擇載具方式。",
      },
      {
        q: "Q5：若收到商品與網站描述不符怎麼辦？",
        a: "KÉSH 於上架時會完整呈現商品所有細節，並於出貨前再次檢查、拍照、錄影留存。請開箱前請全程錄影確保您的權益，若您收到商品與描述有明顯落差，請立即聯繫客服，我們將全程協助處理。",
      },
    ],
  },
  {
    category: "二、寄賣服務 (Consignment)",
    items: [
      {
        q: "Q6：寄賣服務是否仍有提供？",
        a: "是的，KÉSH 提供精品寄賣服務。目前僅受理保存狀況良好、結構完整之精品商品。",
      },
      {
        q: "Q7：哪些品牌可以寄賣？",
        a: (
          <div>
            <p>主要受理品牌包含：Hermès、Chanel、Louis Vuitton、Dior、Gucci、Loewe、Celine、YSL、Goyard、Prada 等精品品牌。</p>
            <p className="mt-2">其他品牌可先透過客服諮詢評估。</p>
            <Link href="/contact" className="inline-flex items-center gap-1 mt-2 text-[#ef4628] font-bold border-b border-[#ef4628] pb-0.5 hover:opacity-80">
              點我聯繫客服諮詢
            </Link>
          </div>
        ),
      },
      {
        q: "Q8：寄賣手續費是多少？",
        a: (
          <div>
            <p>所有寄賣商品一律收取：<span className="font-bold text-gray-900">成交金額之 20% 手續費</span>。</p>
            <p className="text-sm text-gray-500 mt-1">包含：開立發票、營業稅、服務費、物流收寄運費。</p>
            <p className="mt-1">不另收上架費、物流費，拍攝費、曝光費或倉儲費。</p>
          </div>
        ),
      },
      {
        q: "Q9：寄賣流程如何進行？",
        a: (
          <ol className="list-decimal pl-5 space-y-1">
            <li>線上諮詢提交商品照片 (需製作寄賣表單)</li>
            <li>專員提供建議售價</li>
            <li>完成寄賣合約</li>
            <li>KÉSH 物流至府上收貨</li>
            <li>KÉSH 拍攝、上架、國際曝光</li>
            <li>商品售出後通知領款</li>
          </ol>
        ),
      },
      {
        q: "Q10：寄賣期間可以提前取回嗎？",
        a: "可以。寄賣期間最短 1 個月，最長 6 個月。如需提前取回，請提前 3–7 天通知客服。",
      },
    ],
  },
  {
    category: "三、付款方式與金流 (Payment Options)",
    items: [
      {
        q: "Q11：支援哪些付款方式？",
        a: "目前支援：VISA、MasterCard、JCB、Apple Pay、Google Pay、PayPal（國際用戶）以及銀行轉帳。實際可用方式依結帳頁面顯示為準。",
      },
      {
        q: "Q12：刷卡會有額外手續費嗎？",
        a: "不會。KÉSH de¹ 不加收任何刷卡手續費。",
      },
    ],
  },
  {
    category: "四、寄送與國際配送 (Shipping)",
    items: [
      {
        q: "Q13：是否提供國際寄送？",
        a: "是的。KÉSH de¹ 提供全球配送服務，包含：日本、韓國、新加坡、香港、澳門、歐美等地區。關稅依各國法規由收件人負擔。",
      },
      {
        q: "Q14：商品多久可以寄出？",
        a: (
          <ul className="list-disc pl-5">
            <li><span className="font-bold">現貨商品：</span>24 小時內出貨（不含假日）</li>
            <li><span className="font-bold">預購商品：</span>依頁面標示時間出貨</li>
            <li className="list-none mt-1 text-sm text-gray-500">出貨後將提供物流追蹤資訊。</li>
          </ul>
        ),
      },
    ],
  },
  {
    category: "五、鑑定與品況 (Authentication & Condition)",
    items: [
      {
        q: "Q15：商品鑑定流程包含哪些項目？",
        a: "由合格鑑定師依以下流程檢查：五金刻印與重量、皮革紋路與手感、車縫線距與結構、標籤字體與年份編碼、資料庫與市場比對。",
      },
      {
        q: "Q16：品況等級如何定義？",
        a: (
          <div className="space-y-2">
            <p>採用國際通用分級標準：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded"><span className="font-bold text-[#ef4628]">S 級</span>：近全新，幾乎無使用痕跡</div>
              <div className="bg-gray-50 p-2 rounded"><span className="font-bold text-[#ef4628]">A 級</span>：輕微痕跡，整體非常良好</div>
              <div className="bg-gray-50 p-2 rounded"><span className="font-bold text-[#ef4628]">AB 級</span>：一般使用痕跡，外觀良好</div>
              <div className="bg-gray-50 p-2 rounded"><span className="font-bold text-[#ef4628]">B 級</span>：明顯使用痕跡，適合重視實用者</div>
            </div>
            <p>所有品況皆以照片與說明完整揭露。</p>
          </div>
        ),
      },
      {
        q: "Q17：瑕疵會如實呈現嗎？",
        a: "是的。KÉSH de¹ 承諾：零隱瞞｜零美化｜零模糊呈現。",
      },
    ],
  },
  {
    category: "六、會員制度 (Membership)",
    items: [
      {
        q: "Q18：是否需要註冊會員才能購買？",
        a: "建議註冊會員，以便：查詢訂單、追蹤物流、下載鑑定證書以及管理帳戶資料。",
      },
      {
        q: "Q19：是否有會員分級制度？",
        a: "KÉSH de¹ 採用透明定價，不以消費金額區分等級。每一位會員皆為尊榮貴賓。",
      },
    ],
  },
  {
    category: "七、資訊安全與隱私 (Legal & Privacy)",
    items: [
      {
        q: "Q20：會員資料是否安全？",
        a: "是的。KÉSH de¹ 嚴格遵守個資法規範，所有資料僅用於訂單與服務用途，絕不外流。",
      },
    ],
  },
  {
    category: "八、其他常見問題 (General)",
    items: [
      {
        q: "Q21：為什麼不同平台售價不同？",
        a: "因平台抽成、物流、稅務與服務內容不同而調整售價。",
      },
      {
        q: "Q22：為什麼部分商品售價高於專櫃？",
        a: "因專櫃配貨制度、年度調價、稀有度與市場需求影響。",
      },
    ],
  },
];

// --- 單個問題組件 ---
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 px-2 hover:bg-gray-50 transition-colors text-left"
      >
        <span className={`font-medium text-[15px] ${isOpen ? 'text-[#ef4628]' : 'text-gray-800'}`}>
          {question}
        </span>
        <span className="ml-4 text-gray-400">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-2 text-sm text-gray-600 leading-relaxed tracking-wide">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 主頁面組件 ---
const FAQPage = () => {
  return (
    <div className="min-h-screen bg-white pt-[60px] md:pt-[100px] pb-20">
      {/* 頂部標題區域 */}
      <div className="bg-gray-50 py-16 px-4 mb-12">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-black mb-4">FAQ</h1>
          <p className="text-[#ef4628] font-bold text-sm tracking-[0.2em] uppercase mb-6">Common Questions</p>
          <div className="h-[2px] w-[50px] bg-black mx-auto mb-8"></div>
          
          <div className="text-gray-600 text-sm md:text-[15px] leading-7 tracking-wide space-y-2">
            <p>感謝您來到 KÉSH de¹ 凱仕國際精品。</p>
            <p>無論您是首次接觸精品，或是長期收藏者，我們都希望以最清楚、透明、專業的方式陪伴您完成每一次選擇。</p>
            <p>KÉSH 彙整了貴賓最關心的重點問題，協助您快速找到答案，讓您的購物體驗更加安心。</p>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        {faqData.map((section, index) => (
          <div key={index} className="mb-12">
            {/* 分類標題 */}
            <h2 className="text-lg font-bold text-black border-l-4 border-[#ef4628] pl-4 mb-6 uppercase tracking-wider">
              {section.category}
            </h2>
            
            {/* 問題列表 */}
            <div className="bg-white">
              {section.items.map((item, idx) => (
                <AccordionItem key={idx} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 底部結語 */}
      <div className="max-w-[800px] mx-auto px-6 py-12 text-center border-t border-gray-100 mt-8">
        <h3 className="text-xl font-bold mb-4 tracking-widest">KÉSH de¹</h3>
        <p className="text-gray-500 text-sm leading-7 mb-8">
          感謝您閱讀 FAQ 專區。我們相信，真正的精品體驗源自透明、細緻與信任。<br className="hidden md:block"/>
          KÉSH de¹ 將持續以最高標準陪伴每位藏家，願您在這裡找到值得收藏的精品與值得信賴的服務。
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-black text-white text-sm font-bold tracking-widest hover:bg-[#ef4628] transition-colors duration-300">
                聯繫我們
            </Link>
            <Link href="/category" className="px-8 py-3 border border-black text-black text-sm font-bold tracking-widest hover:bg-gray-50 transition-colors duration-300">
                繼續購物
            </Link>
        </div>
        
        <p className="text-xs text-gray-400 mt-12 tracking-widest uppercase">
          A Value of Priority. A Beginning of Dreams.
        </p>
      </div>
    </div>
  );
};

export default FAQPage;