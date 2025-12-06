// Redis is currently disabled - all operations are no-ops
// To enable, install and start Redis, then restore the actual implementation

const DEFAULT_TTL = 3600;

module.exports = {
  get isOpen() {
    return false;
  },
  get isReady() {
    return false;
  },
  async get(key) {
    return null;
  },
  async set(key, value, options) {
    return null;
  },
  async del(key) {
    return null;
  },
};
