// Cache is disabled - Redis not available
// All cache operations are no-ops

const DEFAULT_TTL = 3600; // 1 hour

const get = async (key) => null;
const set = async (key, value, ttl) => {};
const del = async (key) => {};

module.exports = {
  get,
  set,
  del,
  DEFAULT_TTL,
};
