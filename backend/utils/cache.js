const redisClient = require("./redis");

const DEFAULT_TTL = 3600; // 1 hour

/**
 * Get data from cache
 * @param {string} key
 * @returns {Promise<any|null>}
 */
const get = async (key) => {
  try {
    if (!redisClient.isOpen) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache Get Error:", error);
    return null;
  }
};

/**
 * Set data to cache
 * @param {string} key
 * @param {any} value
 * @param {number} ttl - Time to live in seconds
 */
const set = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    if (!redisClient.isOpen) return;
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  } catch (error) {
    console.error("Cache Set Error:", error);
  }
};

/**
 * Delete data from cache
 * @param {string} key
 */
const del = async (key) => {
  try {
    if (!redisClient.isOpen) return;
    await redisClient.del(key);
  } catch (error) {
    console.error("Cache Del Error:", error);
  }
};

module.exports = {
  get,
  set,
  del,
  DEFAULT_TTL,
};
