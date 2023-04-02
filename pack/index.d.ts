declare interface AsHotStorageType {
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
   * @returns {Promise<AsHotStorageType>} module
   */
  (): Promise<AsHotStorageType>; // if you are using cjs
  default: AsHotStorageType;
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
  setString(key: string, value: string, ttlSeconds?: number): void;

  /**
   * assembly/index/getString
   * @param key `~lib/string/String`
   * @returns `~lib/string/String | null` string-typed value by the associated key
   * @throws if existing key to be overwritten is not of type string
   */
  getString(key: string): string | null;

  /**
   * Removes key-value pair
   *
   * assembly/index/removeString
   * @param key `~lib/string/String`
   */
  removeString(key: string): void;

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
  setInt(key: string, value: number, ttlSeconds?: number): void;

  /**
   * assembly/index/getInt
   * @param key `~lib/string/String`
   * @returns `i32` integer-typed value by the associated key
   * @throws if existing key to be overwritten is not of type integer
   */
  getInt(key: string): number;

  /**
   * Removes key-value pair
   *
   * assembly/index/removeInt
   * @param key `~lib/string/String`
   */
  removeInt(key: string): void;

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
  setFloat(key: string, value: number, ttlSeconds?: number): void;

  /**
   * assembly/index/getFloat
   * @param key `~lib/string/String`
   * @returns `f64` float-typed value by the associated key
   * @throws if existing key to be overwritten is not of type string
   */
  getFloat(key: string): number;

  /**
   * Removes key-value pair
   *
   * assembly/index/removeFloat
   * @param key `~lib/string/String`
   */
  removeFloat(key: string): void;

  /**
   * assembly/index/expiringKeyLoop
   */
  expiringKeyLoop(): void;

  /**
   * assembly/storageInfo/activeKeysSize
   * @returns {number} active key size
   */
  activeKeysSize(): number;

  /**
   * assembly/storageInfo/activeKeys
   * @returns `~lib/array/Array<~lib/string/String>` active key array
   */
  activeKeys(): Array<string>;

  /**
   * assembly/storageInfo/dump
   * @returns `~lib/string/String` the json-string dump of the whole storage
   */
  dump(): string;

  /** gracefully shutdown hot storage */
  stop(): void;


  /** restarts event loop */
  restart(): void;
}

declare const AsHotStorage: AsHotStorageType;
export = AsHotStorage;
