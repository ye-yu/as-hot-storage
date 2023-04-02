export class TypedStoredValue<T> {
  constructor(
    readonly value: T,
    readonly expireAt: u64,
    readonly isPermanent: boolean,
  ) {}
}
