import { KeyInfo } from "./KeyInfo";
import { TypedStoredValue } from "./StoredValue";
import { expiringKeyStorage, keyInfos } from "./storages";

export function setToStorage<V>(
  storage: Map<string, TypedStoredValue<V>>,
  key: string,
  keyInfo: KeyInfo,
  storedValue: TypedStoredValue<V>
): void {
  storage.set(key, storedValue);
  keyInfos.set(key, keyInfo);
  if (storedValue.isPermanent) return;
  expiringKeyStorage.add(keyInfo);
}
