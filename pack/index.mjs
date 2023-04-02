async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // to allow return null
          if (message === "null" || message === null) {
            throw Error("null");
          }
          // @external.js
          throw Error(
            `${message} in ${fileName}:${lineNumber}:${columnNumber}`
          );
        })();
      },
      "Date.now":
        // ~lib/bindings/dom/Date.now() => f64
        Date.now,
      seed() {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random();
        })();
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf(
    {
      setString(key, value, ttlSeconds) {
        // assembly/index/setString(~lib/string/String, ~lib/string/String, u32?) => void
        key = __retain(__lowerString(key) || __notnull());
        value = __lowerString(value) || __notnull();
        try {
          exports.__setArgumentsLength(arguments.length);
          exports.setString(key, value, ttlSeconds);
        } finally {
          __release(key);
        }
      },
      getString(key) {
        // assembly/index/getString(~lib/string/String) => ~lib/string/String | null
        key = __lowerString(key) || __notnull();
        return __liftString(exports.getString(key) >>> 0);
      },
      setInt(key, value, ttlSeconds) {
        // assembly/index/setInt(~lib/string/String, i32, u32?) => void
        key = __lowerString(key) || __notnull();
        exports.__setArgumentsLength(arguments.length);
        exports.setInt(key, value, ttlSeconds);
      },
      getInt(key) {
        // assembly/index/getInt(~lib/string/String) => i32
        key = __lowerString(key) || __notnull();
        return exports.getInt(key);
      },
      setFloat(key, value, ttlSeconds) {
        // assembly/index/setFloat(~lib/string/String, f64, u32?) => void
        key = __lowerString(key) || __notnull();
        exports.__setArgumentsLength(arguments.length);
        exports.setFloat(key, value, ttlSeconds);
      },
      getFloat(key) {
        // assembly/index/getFloat(~lib/string/String) => f64
        key = __lowerString(key) || __notnull();
        return exports.getFloat(key);
      },
    },
    exports
  );
  function __liftString(pointer) {
    if (!pointer) return null;
    const end =
        (pointer + new Uint32Array(memory.buffer)[(pointer - 4) >>> 2]) >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let start = pointer >>> 1,
      string = "";
    while (end - start > 1024)
      string += String.fromCharCode(
        ...memoryU16.subarray(start, (start += 1024))
      );
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i)
      memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else
        throw Error(
          `invalid refcount '${refcount}' for reference '${pointer}'`
        );
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  return adaptedExports;
}
const {
  setString,
  getString,
  removeString,
  setInt,
  getInt: _getInt,
  removeInt,
  setFloat,
  getFloat: _getFloat,
  removeFloat,
  expiringKeyLoop,
  activeKeysSize,
  activeKeys,
  dump,
} = await (async (url) =>
  instantiate(
    await (async () => {
      try {
        return await globalThis.WebAssembly.compileStreaming(
          globalThis.fetch(url)
        );
      } catch {
        return globalThis.WebAssembly.compile(
          await (await import("node:fs/promises")).readFile(url)
        );
      }
    })(),
    {}
  ))(new URL("app.wasm", import.meta.url));

setInterval(expiringKeyLoop, 10000);

function wrapNullErrorAsNullForGetFunctions(cb) {
  return (key) => {
    try {
      return cb(key);
    } catch (error) {
      if (error?.message === "null") return null;
      throw error;
    }
  };
}

const getInt = wrapNullErrorAsNullForGetFunctions(_getInt);
const getFloat = wrapNullErrorAsNullForGetFunctions(_getFloat);

export {
  setString,
  getString,
  removeString,
  setInt,
  getInt,
  removeInt,
  setFloat,
  getFloat,
  removeFloat,
  activeKeysSize,
  activeKeys,
  dump,
};
