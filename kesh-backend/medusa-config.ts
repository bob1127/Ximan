import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const DB_URL = "postgresql://postgres.qhefiwluztdmxractwln:jofja5-patZih-hihfet@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

module.exports = defineConfig({
 projectConfig: {
    databaseUrl: DB_URL, 
    databaseDriverOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    http: {
      storeCors: "http://localhost:3000",
      adminCors: "http://localhost:7001,http://localhost:9000",
      authCors: "http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: false, 
  },
  modules: {
    auth: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          { resolve: "@medusajs/auth-emailpass", id: "emailpass" },
          {
            resolve: "@medusajs/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.STORE_AUTH_CALLBACK_URL,
            },
          },
        ],
      },
    },
    // 🔥 強制使用官方的變數名稱，絕對不會指錯路
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/tappay",
            id: "tappay",
            options: {}
          }
        ]
      }
    }
  }
})