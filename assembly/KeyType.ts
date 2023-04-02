export class KeyType{
  static readonly String: KeyType = new KeyType("String");
  static readonly Int: KeyType = new KeyType("Int");
  static readonly Float: KeyType = new KeyType("Float");
  constructor(readonly name: string) {}

  toString(): string {
    return `[KeyType ${this.name}]`;
  }
}
