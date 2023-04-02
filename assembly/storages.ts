import { KeyInfo } from "./KeyInfo";
import { TypedStoredValue } from "./StoredValue";

export const stringStorage = new Map<string, TypedStoredValue<string>>();
export const intStorage = new Map<string, TypedStoredValue<i32>>();
export const floatStorage = new Map<string, TypedStoredValue<f64>>();
export const keyInfos = new Map<string, KeyInfo>();
export const expiringKeyStorage = new Set<KeyInfo>();
