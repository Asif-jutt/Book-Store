const redis = require("redis");
const logger = require("../utils/logger");
const config = require("./environment");

let redisClient;

const initializeRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on("error", (error) => {
      logger.error(`Redis Client Error: ${error}`);
    });

    redisClient.on("connect", () => {
      logger.info("Redis Client Connected");
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error(
      "Redis client not initialized. Call initializeRedis first.",
    );
  }
  return redisClient;
};

// Cache service utilities
const cacheService = {
  async set(key, value, ttlSeconds = 3600) {
    try {
      const client = getRedisClient();
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await client.setEx(key, ttlSeconds, serialized);
      } else {
        await client.set(key, serialized);
      }
    } catch (error) {
      logger.warn(`Cache set error for key ${key}: ${error.message}`);
    }
  },

  async get(key) {
    try {
      const client = getRedisClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.warn(`Cache get error for key ${key}: ${error.message}`);
      return null;
    }
  },

  async delete(key) {
    try {
      const client = getRedisClient();
      await client.del(key);
    } catch (error) {
      logger.warn(`Cache delete error for key ${key}: ${error.message}`);
    }
  },

  async clear(pattern) {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      logger.warn(`Cache clear error for pattern ${pattern}: ${error.message}`);
    }
  },

  async increment(key, amount = 1) {
    try {
      const client = getRedisClient();
      return await client.incrBy(key, amount);
    } catch (error) {
      logger.warn(`Cache increment error for key ${key}: ${error.message}`);
      return null;
    }
  },
};

module.exports = {
  initializeRedis,
  getRedisClient,
  cacheService,
};
