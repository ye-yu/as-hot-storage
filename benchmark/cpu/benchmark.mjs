import { randomUUID } from "crypto"

const os = await import('os');

const [,,type] = process.argv

if (type !== "redis" && type !== "hot-storage") {
  throw new Error("pass the correct benchmarking type: redis or hot-storage")
}

const { methods } = type === "redis" ? await import("./redis.mjs") : await import("./hot-storage.mjs")

const cpu = os.cpus()[0];

// CPU Info
let info = `CPU: ${cpu.model} ${cpu.speed}GHz\n`
info += `Cores: ${os.cpus().length} Physical\n`;

console.log(info)

// Initial value; wait at little amount of time before making a measurement.
let timesBefore = os.cpus().map(c => c.times);

// Call this function periodically e.g. using setInterval, 
function getAverageUsage() {
    let timesAfter = os.cpus().map(c => c.times);
    let timeDeltas = timesAfter.map((t, i) => ({
        user: t.user - timesBefore[i].user,
        sys: t.sys - timesBefore[i].sys,
        idle: t.idle - timesBefore[i].idle
    }));

    timesBefore = timesAfter;

    const fraction = timeDeltas
    .map(times => 1 - times.idle / (times.user + times.sys + times.idle))
    .reduce((l1, l2) => l1 + l2) / timeDeltas.length

    if (isNaN(fraction)) return `<unknown>`
    return `${(fraction * 100).toFixed(2)}%`;
}

const cpuUsagesHistory = []


for (let index = 0; index < 1000000; index++) {
  const key = `key-${index}`
  const value = randomUUID()
  await methods.set(key, value)
  await methods.get(key)
  if (index % 10000 === 0) {
    cpuUsagesHistory.push(getAverageUsage())
  }
}
methods.close()

console.table(cpuUsagesHistory)