import redis from "ioredis";

const client = new redis(
  Number(process.env.REDIS_PORT) || 6379,
  process.env.REDIS_HOST ?? "127.0.0.1"
);

export const methods = {
  set(key, value) {
    return client.set(key, value);
  },
  get(key) {
    return client.get(key);
  },
  delete(key) {
    return client.del(key);
  },
  close() {
    return client.disconnect();
  },
};
