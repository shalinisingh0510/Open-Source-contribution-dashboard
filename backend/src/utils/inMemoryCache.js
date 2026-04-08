export class InMemoryCache {
  constructor(ttlSeconds = 300) {
    this.ttlSeconds = ttlSeconds;
    this.cache = new Map();
  }

  get(key) {
    const value = this.cache.get(key);
    if (!value) {
      return null;
    }

    if (Date.now() > value.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return value.data;
  }

  set(key, data, ttlSeconds = this.ttlSeconds) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}
