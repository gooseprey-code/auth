import Redis from 'ioredis'
import ENV from './env.js'

export const redis = new Redis (ENV.UPSTASH_REDIS_URL, {
    family: 4,
    maxRetrieveRequsts: 3,
    enableReadyCheck: true
})

redis.on("connect", () => {
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});
