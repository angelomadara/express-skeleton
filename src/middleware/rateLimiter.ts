import rateLimit from "express-rate-limit";
import { Redis } from "@upstash/redis";
import { UpstashStore } from "./rateLimitStore";
import config from "../config";

/**
 * Build rate-limiter options.
 * Uses Upstash Redis as the backing store when UPSTASH_REDIS_URL is set,
 * otherwise falls back to the built-in MemoryStore (acceptable for dev).
 */
function getRateLimitOptions(windowMs: number, max: number) {
  const base = {
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
  };

  if (config.upstashRedisUrl && config.upstashRedisToken) {
    const client = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken,
    });
    return { ...base, store: new UpstashStore(client) };
  }

  return base;
}

/**
 * General-purpose rate limiter.
 * Applies globally to all API routes.
 */
export const generalLimiter = rateLimit(
  getRateLimitOptions(config.rateLimitWindowMs, config.rateLimitMax),
);

/**
 * Stricter limiter for auth-sensitive endpoints (login, register, etc.).
 * 15 requests per 15-minute window by default.
 */
export const authLimiter = rateLimit(
  getRateLimitOptions(15 * 60 * 1000, 15),
);
