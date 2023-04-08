# AssemblyScript Hot Storage

A simple local hot data storage. Just like Redis

# 1. Motivation/Use cases
- To test out WASM for NodeJs servers
- To provide as a quick hot data storage solution before adopting Redis

# 2. Benchmarks
I conducted a [simple benchmark here](https://github.com/ye-yu/as-hot-storage/actions/runs/4594753750/jobs/8114177846) using three different implementations:
1. as-hot-storage
2. plain javascript Map storage
3. redis

They are all based on three different metrics:

## 2.1 Memory usage (Manual GC)
Benchmarking name: Run benchmark (memory)

Benchmarking steps:
1. Get current NodeJS process memory usage as 'before'
2. Loop through 1000000 (one million) steps of setting value into storage
3. Get current NodeJS process memory usage as 'after'
4. Loop through 1000000 (one million) steps of removing the previous value from storage
5. Get current NodeJS process memory usage as 'afterGc'
6. Get max memory usage.


| as-hot-storage | plain JS | redis 🏆 |
|----------------|----------|-------|
| 461 MB         | 808 MB   | 87 MB |

Redis was able to maintain the least memory usage because the data is stored on a different process.
However, as compared to plain JS Map storage, as-hot-storage is able to utilize half as much resources. Therefore, as-hot-storage can be the next best option when the project is not yet ready to adopt Redis.


## 2.2 Computational Speed
Benchmarking name: Run benchmark (speed)

Benchmarking steps:
1. Record start time
2. Loop through 1000000 (one million) steps of setting value into storage
3. Record end time and calculate time taken


| as-hot-storage | plain JS 🏆 | redis     |
|----------------|----------|-----------|
| 7.676 s        | 4.291 s  | 450.016 s |

Plain JS Map storage is the fastest one because it took the least transfer time from the process to the memory. as-hot-storage took slightly longer probably due to transformation of the data structure from JS to WASM, and Redis took the longest probably due to communication time playing a huge factor to transport the data from NodeJS to Redis. 

# 2.3 Others
I also prepared two other benchmarking: CPU, and Memory (auto GC-ed). However, I couldn't spend more time on finding a good way to measure CPU usage over time. Plus, Memory (auto GC-ed) also tells us the same story about memory; I was just curious if I needed to manually call GC for memory management.

# 2. Importing

Initialisation

1. If you are using CommonJS

```js
const getStorage = require("as-hot-storage");
// storage is null, must be initialised with the async getter function
storage = null;

async function initializeStorage() {
  storage = await getStorage();
}
```

2. If you are using ESM

```js
import storage from "as-hot-storage";
// storage can be used right away
```

# 3. Usage

```js
// set string, similar with setInt and setFloat
storage.setString("key", "value");
storage.setString("key", "value", 5 /* expires in 5 seconds */);

// set string: throws error for incompatible type
storage.setString("someKey", "hello");
storage.setInt("someKey", 5);
// throws error because "someKey" was set as string before and it has not expired

// get value, similar with getInt and getFloat
storage.getString("key");
// throws error of key is not the correct type

// remove value, similar with removeInt and removeFloat
storage.removeString("key");
storage.getString("key"); // === null
```

# 4. On exit
When all internal processes has completed, you must close the hot storage to gracefully shutdown.

```js
import storage from 'as-hot-storage';

storage.setInt("pi", 3)
// extensive operations

storage.close()
```