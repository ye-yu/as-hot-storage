declare interface AsHotStorage {
  memory: WebAssembly.Memory;
  /**
   * assembly/index/setString
   * @param key `~lib/string/String`
   * @param value `~lib/string/String`
   * @param ttlSeconds `u32`
   */
  setString(
    key: string,
    value: string,
    ttlSeconds?: number
  ): void;
  /**
   * assembly/index/getString
   * @param key `~lib/string/String`
   * @returns `~lib/string/String | null`
   */
  getString(key: string): string | null;
  /**
   * assembly/index/setInt
   * @param key `~lib/string/String`
   * @param value `i32`
   * @param ttlSeconds `u32`
   */
  setInt(
    key: string,
    value: number,
    ttlSeconds?: number
  ): void;
  /**
   * assembly/index/getInt
   * @param key `~lib/string/String`
   * @returns `i32`
   */
  getInt(key: string): number;
  /**
   * assembly/index/setFloat
   * @param key `~lib/string/String`
   * @param value `f64`
   * @param ttlSeconds `u32`
   */
  setFloat(
    key: string,
    value: number,
    ttlSeconds?: number
  ): void;
  /**
   * assembly/index/getFloat
   * @param key `~lib/string/String`
   * @returns `f64`
   */
  getFloat(key: string): number;
  /**
   * assembly/index/activeKeys
   * @returns `i32`
   */
  activeKeys(): number;
  /**
   * assembly/index/expiringKeyLoop
   */
  expiringKeyLoop(): void;
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
 * @returns module
 */
declare function getStorage(): Promise<AsHotStorage>;

export = getStorage;
