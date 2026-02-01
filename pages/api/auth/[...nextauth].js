import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // 開啟 Debug 模式，會在終端機顯示詳細流程
  debug: true, 
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[NextAuth] signIn Callback 觸發", { userEmail: user.email }); // 🔍 Debug 3

      if (account.provider === "google") {
        try {
          // 決定 API 網址 (本地開發 vs 上線環境)
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
          console.log("[NextAuth] 準備呼叫同步 API:", `${apiUrl}/api/auth/social-sync`); // 🔍 Debug 4

          const res = await fetch(`${apiUrl}/api/auth/social-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              avatar: user.image
            }),
          });
          
          const data = await res.json();
          console.log("[NextAuth] 同步 API 回傳:", data); // 🔍 Debug 5
          
          if (res.ok && data.token) {
            user.accessToken = data.token; 
            user.wpUserId = data.user_id;
            return true;
          } else {
            console.error("[NextAuth] 同步失敗:", data.message);
            return false; // 拒絕登入
          }
        } catch (e) {
          console.error("[NextAuth] 嚴重錯誤:", e);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.wpUserId = user.wpUserId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.wpUserId = token.wpUserId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});