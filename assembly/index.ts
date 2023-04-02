// The entry file of your WebAssembly module.

import { KeyInfo } from "./KeyInfo";
import { KeyType } from "./KeyType";
import { TypedStoredValue } from "./StoredValue";
import { removeFromStorage } from "./removeFromStorage";
import { setToStorage } from "./setToStorage";
import {
  expiringKeyStorage,
  floatStorage,
  intStorage,
  keyInfos,
  stringStorage,
} from "./storages";

const PERMANENT_STORAGE: u32 = -1;
const NULL_AS_ERROR = new Error("null")

function checkKeyType(key: string, keyType: KeyType): void {
  if (!keyInfos.has(key)) return;
  const keyInfo = keyInfos.get(key);
  if (keyInfo.keyType === keyType) return;
  throw new Error(
    `incompatible key type with existing type,` +
      ` expecting ${keyInfo.keyType} but got ${keyType}: ${key}`
  );
}

export function setString(
  key: string,
  value: string,
  ttlSeconds: u32 = PERMANENT_STORAGE
): void {
  checkKeyType(key, KeyType.String);
  const now = u32(Date.now());
  const expireAt = now + ttlSeconds * 1000;
  const isPermanent = ttlSeconds === PERMANENT_STORAGE;
  const storedValue = new TypedStoredValue<string>(
    value,
    expireAt,
    isPermanent
  );
  const keyInfo = keyInfos.has(key)
    ? keyInfos.get(key)
    : new KeyInfo(key, KeyType.String, expireAt, isPermanent);
  setToStorage(stringStorage, key, keyInfo, storedValue);
}

export function getString(key: string): string | null {
  checkKeyType(key, KeyType.String);
  const storedValue: TypedStoredValue<string> | null = stringStorage.has(key)
    ? stringStorage.get(key)
    : null;
  if (storedValue === null) return null;
  const now = u32(Date.now());
  if (now > storedValue.expireAt && !storedValue.isPermanent) {
    removeString(key);
    return null;
  }
  return storedValue.value;
}

function removeString(key: string): void {
  removeFromStorage(stringStorage, key);
}

export function setInt(
  key: string,
  value: i32,
  ttlSeconds: u32 = PERMANENT_STORAGE
): void {
  checkKeyType(key, KeyType.Int);
  const now = u32(Date.now());
  const expireAt = now + ttlSeconds * 1000;
  const isPermanent = ttlSeconds === PERMANENT_STORAGE;
  const storedValue = new TypedStoredValue<i32>(value, expireAt, isPermanent);
  const keyInfo = keyInfos.has(key)
    ? keyInfos.get(key)
    : new KeyInfo(key, KeyType.Int, expireAt, isPermanent);
  setToStorage(intStorage, key, keyInfo, storedValue);
}

export function getInt(key: string): i32 {
  checkKeyType(key, KeyType.Int);
  const storedValue: TypedStoredValue<i32> | null = intStorage.has(key)
    ? intStorage.get(key)
    : null;
  if (storedValue === null) throw NULL_AS_ERROR;
  const now = u32(Date.now());
  if (now > storedValue.expireAt && !storedValue.isPermanent) {
    removeInt(key);
    throw NULL_AS_ERROR;
  }
  return storedValue.value;
}

function removeInt(key: string): void {
  removeFromStorage(intStorage, key);
}

export function setFloat(
  key: string,
  value: f64,
  ttlSeconds: u32 = PERMANENT_STORAGE
): void {
  checkKeyType(key, KeyType.Float);
  const now = u32(Date.now());
  const expireAt = now + ttlSeconds * 1000;
  const isPermanent = ttlSeconds === PERMANENT_STORAGE;
  const storedValue = new TypedStoredValue<f64>(value, expireAt, isPermanent);
  const keyInfo = keyInfos.has(key)
    ? keyInfos.get(key)
    : new KeyInfo(key, KeyType.Float, expireAt, isPermanent);
  setToStorage(floatStorage, key, keyInfo, storedValue);
}

export function getFloat(key: string): f64 {
  checkKeyType(key, KeyType.Float);
  const storedValue: TypedStoredValue<f64> | null = floatStorage.has(key)
    ? floatStorage.get(key)
    : null;
  if (storedValue === null) throw NULL_AS_ERROR;
  const now = u32(Date.now());
  if (now > storedValue.expireAt && !storedValue.isPermanent) {
    removeFloat(key);
    throw NULL_AS_ERROR;
  }
  return storedValue.value;
}

export function activeKeys(): i32 {
  function keyIsActive(e: KeyInfo, _: i32, __: KeyInfo[]): boolean {
    const now = u32(Date.now());
    return e.isPermanent || now < e.expiredAt
  };

  return keyInfos.values().filter(keyIsActive).length
}

function removeFloat(key: string): void {
  removeFromStorage(floatStorage, key);
}


function minI32(left: i32, right: i32): i32 {
  return left < right ? left : right
}

export function expiringKeyLoop(): void {
  while (true) {
    const keySize = expiringKeyStorage.size;
    const randomisedKeys = expiringKeyStorage
      .values()
      .sort(() => i32(Math.random() - 0.5))
      .slice(0, minI32(20, keySize));
    const now = u32(Date.now());
    let expired = 0
    for (let index = 0; index < randomisedKeys.length; index++) {
      const element = randomisedKeys[index];
      if (now <= element.expiredAt) {
        continue;
      }

      ++expired;
      if (element.keyType === KeyType.String) {
        removeFromStorage(stringStorage, element.keyName);
      } else if (element.keyType === KeyType.Int) {
        removeFromStorage(intStorage, element.keyName);
      } else if (element.keyType === KeyType.Float) {
        removeFromStorage(floatStorage, element.keyName);
      }
    }
  
    if (expired < 5) {
      return
    }
  }
}
