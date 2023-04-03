import { randomUUID } from "crypto";

const [, , type] = process.argv;

if (type !== "redis" && type !== "hot-storage" && type !== "plain") {
  throw new Error("pass the correct benchmarking type: redis or hot-storage");
}

const { methods } =
  type === "redis"
    ? await import("./redis.mjs")
    : await import("./hot-storage.mjs");

const formatMemoryUsage = (data) =>
  `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
function getFormattedMemoryUsage() {
  const mem = process.memoryUsage();
  return formatMemoryUsage(mem.rss);
}

const memoryUsages = [getFormattedMemoryUsage()];

for (let index = 0; index < 5; index++) {
  const size = 1000000;

  for (let index = 0; index < size; index++) {
    const key = `key-${index}`;
    const keyToDelete = `key-${index - 500}`;
    const value = randomUUID();
    await methods.set(key, value);
    await methods.get(key);
    await methods.delete(key)
  }

  memoryUsages.push(getFormattedMemoryUsage())
}

methods.close();
console.table(memoryUsages);
