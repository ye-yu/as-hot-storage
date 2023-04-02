import { randomUUID } from "crypto"

const [,,type] = process.argv

if (type !== "redis" && type !== "hot-storage") {
  throw new Error("pass the correct benchmarking type: redis or hot-storage")
}

const { methods } = type === "redis" ? await import("./redis.mjs") : await import("./hot-storage.mjs")

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
function getFormattedMemoryUsage() {
  const mem = process.memoryUsage()
  return formatMemoryUsage(mem.rss)
}

const before = getFormattedMemoryUsage(0)

for (let index = 0; index < 100000; index++) {
  const key = `key-${index}`
  const value = randomUUID()
  await methods.set(key, value)
  await methods.get(key)
}
methods.close()

const after = getFormattedMemoryUsage(0)

console.table([before, after])