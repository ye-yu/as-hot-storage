import { KeyType } from "./KeyType";

export class KeyInfo {
  constructor(
    readonly keyName: string,
    readonly keyType: KeyType,
    readonly expiredAt: u64,
    readonly isPermanent: boolean
  ) {}
}
