import { TypedStoredValue } from "./StoredValue";
import { expiringKeyStorage, keyInfos } from "./storages";

export function removeFromStorage<V>(
  storage: Map<string, TypedStoredValue<V>>,
  key: string
): void {
  if (!keyInfos.has(key)) {
    return;
  }
  storage.delete(key);
  const keyInfo = keyInfos.get(key);
  keyInfos.delete(key);
  if (!expiringKeyStorage.has(keyInfo)) {
    return;
  }

  expiringKeyStorage.delete(keyInfo);
}
