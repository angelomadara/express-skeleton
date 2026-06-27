import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/skeleton",
  pageLimit: parseInt(process.env.PAGE_LIMIT || "10", 10),

  // ── JWT ────────────────────────────────────────
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",

  // ── CORS ───────────────────────────────────────
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:3000"],

  // ── Request Body ───────────────────────────────
  bodyLimit: process.env.BODY_LIMIT || "10kb",

  // ── Rate Limiting ──────────────────────────────
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),   // 15 min default
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),                 // 100 req/window default

  // ── Upstash Redis (rate-limit store) ────────────
  upstashRedisUrl: process.env.UPSTASH_REDIS_URL || "",
  upstashRedisToken: process.env.UPSTASH_REDIS_TOKEN || "",
};

export default config;
