import { Redis } from "@upstash/redis";
import type { Store, IncrementResponse } from "express-rate-limit";

/**
 * Express-rate-limit store backed by Upstash Redis (HTTP/REST).
 *
 * Eliminates the unbounded-memory issue of the default MemoryStore
 * by persisting rate-limit state remotely. Window size is passed
 * via the store's `init()` method, called automatically by express-rate-limit.
 */
export class UpstashStore implements Store {
  private client: Redis;
  prefix: string;
  windowMs!: number;

  /**
   * @param client  An @upstash/redis `Redis` instance (configured with url + token).
   * @param prefix  Optional key prefix (default: "rl:").
   */
  constructor(client: Redis, prefix: string = "rl:") {
    this.client = client;
    this.prefix = prefix;
  }

  /**
   * Called automatically by express-rate-limit with the limiter's options.
   */
  init = (options: { windowMs: number }): void => {
    this.windowMs = options.windowMs;
  };

  /**
   * Increment the hit counter for a key and return the new total + reset time.
   */
  increment = async (key: string): Promise<IncrementResponse> => {
    const prefixed = `${this.prefix}${key}`;

    const totalHits = await this.client.incr(prefixed);

    // Set TTL on first hit; Upstash expires keys automatically thereafter
    if (totalHits === 1) {
      await this.client.expire(prefixed, Math.ceil(this.windowMs / 1000));
    }

    const ttl = await this.client.ttl(prefixed);
    const resetTime = new Date(Date.now() + ttl * 1000);

    return { totalHits, resetTime };
  };

  /**
   * Decrement the hit counter (used when a request fails validation).
   */
  decrement = async (key: string): Promise<void> => {
    await this.client.decr(`${this.prefix}${key}`);
  };

  /**
   * Reset the hit counter for a key.
   */
  resetKey = async (key: string): Promise<void> => {
    await this.client.del(`${this.prefix}${key}`);
  };
}
