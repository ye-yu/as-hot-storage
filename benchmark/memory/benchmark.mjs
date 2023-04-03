import { randomUUID } from "crypto"

const [,,type] = process.argv

if (type !== "redis" && type !== "hot-storage" && type !== "plain") {
  throw new Error("pass the correct benchmarking type: redis or hot-storage")
}

const { methods } = type === "redis" ? await import("./redis.mjs") : type === "plain" ? await import("./plain-storage.mjs") : await import("./hot-storage.mjs")

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
function getFormattedMemoryUsage() {
  const mem = process.memoryUsage()
  return formatMemoryUsage(mem.rss)
}

const before = getFormattedMemoryUsage(0)

const size = 1000000;

for (let index = 0; index < size; index++) {
  const key = `key-${index}`
  const value = randomUUID()
  await methods.set(key, value)
  await methods.get(key)
}

const after = getFormattedMemoryUsage(0)

if (globalThis.gc) {
  for (let index = 0; index < size; index++) {
    const key = `key-${index}`
    await methods.delete(key)
  }
  gc()
}

const afterGc = getFormattedMemoryUsage(0)

methods.close()
console.table([before, after, afterGc])