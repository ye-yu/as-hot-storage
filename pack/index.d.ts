/**
 * Stores key-value pair with string-typed value.
 * Overwrites existing key if available.
 *
 * assembly/index/setString
 * @param key `~lib/string/String`
 * @param value `~lib/string/String`
 * @param ttlSeconds `u32`
 * @throws if existing key to be overwritten is not of type string
 */
export declare function setString(key: string, value: string, ttlSeconds?: number): void;

/**
 * assembly/index/getString
 * @param key `~lib/string/String`
 * @returns `~lib/string/String | null` string-typed value by the associated key
 * @throws if existing key to be overwritten is not of type string
 */
export declare function getString(key: string): string | null;

/**
 * Removes key-value pair
 * 
 * assembly/index/removeString
 * @param key `~lib/string/String`
 */
export declare function removeString(key: string): void;

/**
 * Stores key-value pair with integer-typed value.
 * Overwrites existing key if available.
 *
 * assembly/index/setInt
 * @param key `~lib/string/String`
 * @param value `i32`
 * @param ttlSeconds `u32`
 * @throws if existing key to be overwritten is not of type integer
 */
export declare function setInt(key: string, value: number, ttlSeconds?: number): void;

/**
 * assembly/index/getInt
 * @param key `~lib/string/String`
 * @returns `i32` integer-typed value by the associated key
 * @throws if existing key to be overwritten is not of type integer
 */
export declare function getInt(key: string): number;

/**
 * Removes key-value pair
 * 
 * assembly/index/removeInt
 * @param key `~lib/string/String`
 */
export declare function removeInt(key: string): void;

/**
 * Stores key-value pair with float-typed value.
 * Overwrites existing key if available.
 *
 * assembly/index/setFloat
 * @param key `~lib/string/String`
 * @param value `f64`
 * @param ttlSeconds `u32`
 * @throws if existing key to be overwritten is not of type float
 */
export declare function setFloat(key: string, value: number, ttlSeconds?: number): void;

/**
 * assembly/index/getFloat
 * @param key `~lib/string/String`
 * @returns `f64` float-typed value by the associated key
 * @throws if existing key to be overwritten is not of type string
 */
export declare function getFloat(key: string): number;

/**
 * Removes key-value pair
 * 
 * assembly/index/removeFloat
 * @param key `~lib/string/String`
 */
export declare function removeFloat(key: string): void;

/**
 * assembly/index/expiringKeyLoop
 */
export declare function expiringKeyLoop(): void;

/**
 * assembly/storageInfo/activeKeysSize
 * @returns {number} active key size
 */
export declare function activeKeysSize(): number;

/**
 * assembly/storageInfo/activeKeys
 * @returns `~lib/array/Array<~lib/string/String>` active key array
 */
export declare function activeKeys(): Array<string>;

/**
 * assembly/storageInfo/dump
 * @returns `~lib/string/String` the json-string dump of the whole storage
 */
export declare function dump(): string;


// if you are using cjs
declare interface AsHotStorage {
  setString: typeof setString;
  getString: typeof getString;
  removeString: typeof removeString;
  setInt: typeof setInt;
  getInt: typeof getInt;
  removeInt: typeof removeInt;
  setFloat: typeof setFloat;
  getFloat: typeof getFloat;
  removeFloat: typeof removeFloat;
  expiringKeyLoop: typeof expiringKeyLoop;
  activeKeysSize: typeof activeKeysSize;
  activeKeys: typeof activeKeys;
  dump: typeof dump;
}

/**
 * Returns async function to instantiate WASM instance
 *
 * ```js
 * const getStorage = require('as-hot-storage')
 * let storage = null;
 *
 * async function instantiate() {
 *   storage = await getStorage()
 *   storage.getString("hello")
 * }
 * ```
 * @returns {Promise<AsHotStorage>} module
 */
export declare function getStorage(): Promise<AsHotStorage>;