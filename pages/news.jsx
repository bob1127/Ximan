import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns"; // 建議安裝: npm install date-fns
import https from "https";

// --- 1. Hero 文章組件 (模仿參考圖上方的大區塊) ---
const HeroPost = ({ post }) => {
  if (!post) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full mb-16 md:mb-24 group cursor-pointer relative"
    >
      <Link href={`/news/${post.slug}`} className="block relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100">
        {/* 圖片 */}
        <div className="absolute inset-0 w-full h-full">
           <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
            unoptimized={true} // 避免外部圖片權限問題
          />
          {/* 遮罩：模仿參考圖的紅色/深色覆蓋效果 */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* 懸浮文字區塊 (模仿參考圖的紅色色塊風格) */}
        <div className="absolute bottom-0 left-0 md:left-auto md:right-[10%] md:bottom-[10%] w-full md:w-[500px] bg-[#ef4628]/90 text-white p-8 md:p-12 backdrop-blur-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-4 border-b border-white/30 pb-4">
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Latest News</span>
                <span className="text-sm font-mono">{post.date}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold uppercase leading-tight mb-4 line-clamp-2">
                {post.title}
            </h2>
            <div 
                className="text-sm md:text-base font-light opacity-90 line-clamp-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
            />
            <div className="mt-6 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                Read More 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- 2. 一般文章卡片 (模仿參考圖下方的網格) ---
const NewsCard = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col"
    >
      <Link href={`/news/${post.slug}`} className="block h-full">
        {/* 圖片容器 */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 mb-5">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized={true}
          />
          {/* 日期懸浮於圖片右上角 (參考圖風格) */}
          <div className="absolute top-0 right-0 bg-white px-3 py-1 text-xs font-mono font-medium text-black">
            {post.date}
          </div>
        </div>

        {/* 文字內容 */}
        <div className="flex flex-col flex-grow border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-[#ef4628] uppercase tracking-widest">
                    News
                </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 uppercase group-hover:text-[#ef4628] transition-colors line-clamp-2">
                {post.title}
            </h3>
            
            <div 
                className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-grow"
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
            />

            <div className="mt-auto">
                <span className="inline-block border-b border-black pb-0.5 text-[10px] font-bold tracking-widest uppercase group-hover:border-[#ef4628] group-hover:text-[#ef4628] transition-colors">
                    View Details
                </span>
            </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- 🔥 主頁面 ---
export default function NewsPage({ posts }) {
  // 將第一篇文章設為 Hero，其餘為 Grid
  const heroPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <>
      <Head>
        <title>Latest News | KÉSH de¹ 凱仕國際精品</title>
        <meta name="description" content="KÉSH de¹ 最新消息、時尚趨勢與品牌公告。" />
      </Head>

      <main className="bg-white min-h-screen pt-24 pb-20">
        
        {/* 頁面標題區 */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6">
            <div>
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">
                    Journal
                </h1>
                <p className="text-sm text-gray-500 tracking-widest uppercase">
                    News & Events / Fashion Trends
                </p>
            </div>
            <div className="hidden md:block text-right">
                <p className="text-xs font-mono text-gray-400">
                    UPDATED: {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            {posts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    目前沒有最新消息。
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <HeroPost post={heroPost} />

                    {/* Grid Section */}
                    {gridPosts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {gridPosts.map((post, index) => (
                                <NewsCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>

        {/* 底部裝飾 */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 mt-24">
             <div className="w-full h-[1px] bg-gray-200"></div>
             <div className="flex justify-between items-center py-6">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">KÉSH de¹ Official</span>
                <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest hover:text-[#ef4628]">Go to Online Store</Link>
             </div>
        </div>

      </main>
    </>
  );
}

// --- 🔥 SSG 抓取 WordPress 文章 ---
export async function getStaticProps() {
  const WC_URL = process.env.WC_SITE_URL; // 這裡共用同一個變數即可，WP API 通常在同一網域

  // 如果沒設定環境變數，防止報錯
  if (!WC_URL) {
    return { props: { posts: [] }, revalidate: 60 };
  }

  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    // 使用 WP REST API: /wp-json/wp/v2/posts
    // _embed: 抓取特色圖片 (Featured Media)
    const res = await fetch(`${WC_URL}/wp-json/wp/v2/posts?_embed&per_page=12&status=publish`, { agent });
    
    if (!res.ok) throw new Error("Failed to fetch posts");
    
    const data = await res.json();

    // 格式化資料
    const formattedPosts = data.map(post => {
      // 1. 處理圖片
      let imageUrl = "/images/placeholder.jpg"; // 預設圖
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
          let src = post._embedded['wp:featuredmedia'][0].source_url;
          // 強制轉 HTTPS
          if (src.startsWith('http://')) {
              src = src.replace('http://', 'https://');
          }
          imageUrl = src;
      }

      // 2. 處理日期
      const dateObj = new Date(post.date);
      const formattedDate = dateObj.toLocaleDateString('en-CA').replace(/-/g, '.'); // 轉成 2025.12.25 格式

      return {
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered,
        date: formattedDate,
        image: imageUrl,
      };
    });

    return {
      props: {
        posts: formattedPosts,
      },
      revalidate: 60, // 每 60 秒更新一次
    };

  } catch (error) {
    console.error("News fetch error:", error);
    return {
      props: { posts: [] },
      revalidate: 60,
    };
  }
}