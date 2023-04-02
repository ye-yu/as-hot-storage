import redis from 'ioredis'

const client = new redis()

export const methods = {
  set(key, value) {
    return client.set(key, value)
  },
  get(key) {
    return client.get(key)
  },
  close() {
    return client.close()
  }
}