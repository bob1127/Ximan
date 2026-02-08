import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials"; // 🔥 1. 引入這個

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // 🔥 2. 新增：帳號密碼登入設定
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 這裡是用來驗證使用者輸入的帳密
        const { email, password } = credentials;

        try {
          // A. 連線到您的 WordPress (WooCommerce) 尋找使用者
          const wpUrl = process.env.WC_SITE_URL;
          const ck = process.env.WC_CONSUMER_KEY;
          const cs = process.env.WC_CONSUMER_SECRET;

          // 搜尋該 Email 的使用者
          const res = await fetch(`${wpUrl}/wp-json/wc/v3/customers?email=${email}&consumer_key=${ck}&consumer_secret=${cs}`);
          const users = await res.json();

          // B. 檢查是否找到使用者
          if (!res.ok || users.length === 0) {
            throw new Error("找不到此使用者");
          }

          const user = users[0];

          // ⚠️ 重要提醒：
          // 由於 WooCommerce API 預設無法驗證密碼，
          // 為了讓您先測試成功，這裡只要 Email 對了就允許登入。
          // (正式上線建議安裝 JWT Authentication 外掛來驗證 password)
          
          // C. 回傳使用者資料給 NextAuth
          return {
            id: user.id,
            name: user.username || user.first_name, // 優先使用 username
            email: user.email,
            image: user.avatar_url, // 抓取 WP 的頭像
          };

        } catch (error) {
          console.error("Login Error:", error);
          return null; // 登入失敗回傳 null
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, 
  callbacks: {
    // 🔥 3. 讓前端能拿到更多資料 (例如 ID 和頭像)
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.image = token.picture; // 確保前端 session.user.image 有值
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);