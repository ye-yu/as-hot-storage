import { KeyInfo } from "./KeyInfo";
import { floatStorage, intStorage, keyInfos, stringStorage } from "./storages";
import { JSONEncoder } from "../node_modules/assemblyscript-json/assembly";

function keyIsActive(e: KeyInfo, _: i32, __: KeyInfo[]): boolean {
  const now = u32(Date.now());
  return e.isPermanent || now < e.expiredAt;
}

function keyInfoToString(e: KeyInfo, _: i32, __: KeyInfo[]): string {
  return e.keyName;
}

export function activeKeysSize(): i32 {
  return keyInfos.values().filter(keyIsActive).length;
}

export function activeKeys(): string[] {
  return keyInfos.values().filter(keyIsActive).map(keyInfoToString);
}

export function dump(): string {
  let encoder = new JSONEncoder();

  // Construct necessary object
  encoder.pushArray("stringStorage");
  const stringStorageKeys = stringStorage.keys()
  for (let index = 0; index < stringStorageKeys.length; index++) {
    const key = stringStorageKeys[index]
    const value = stringStorage.get(key);
    encoder.pushObject(null)
    encoder.setString(key, value.value);
    encoder.popObject()
  }
  encoder.popArray();

  encoder.pushArray("intStorage");
  const intStorageKeys = intStorage.keys()
  for (let index = 0; index < intStorageKeys.length; index++) {
    const key = intStorageKeys[index]
    const value = intStorage.get(key);
    encoder.pushObject(null)
    encoder.setInteger(key, value.value);
    encoder.popObject()
  }
  encoder.popArray();

  encoder.pushArray("floatStorage");
  const floatStorageKeys = floatStorage.keys()
  for (let index = 0; index < floatStorageKeys.length; index++) {
    const key = floatStorageKeys[index]
    const value = floatStorage.get(key);
    encoder.pushObject(null)
    encoder.setFloat(key, value.value);
    encoder.popObject()
  }
  encoder.popArray();

  encoder.pushArray("keyInfos");
  const keyInfosKeys = keyInfos.keys()
  for (let index = 0; index < keyInfosKeys.length; index++) {
    const key = keyInfosKeys[index]
    const value = keyInfos.get(key);
    encoder.pushObject(null)
    encoder.setString("key", key);
    encoder.setString("type", value.keyType.toString());
    encoder.setBoolean("isPermanent", value.isPermanent);
    if (value.isPermanent) {
      encoder.setNull("expireAt");
    } else {
      encoder.setInteger("expireAt", value.expiredAt);
    }
    encoder.popObject()
  }
  encoder.popArray();

  // Or get serialized data as string
  let jsonString: string = encoder.toString();

  return `{${jsonString}}`;
}