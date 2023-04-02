import { describe, it, after, before } from "node:test";
import { strict as assert } from "node:assert";

describe("ESM", () => {

  let storage;
  before(async() => {
    const { default: module } = await import(new URL("../dist/index.mjs", import.meta.url))
    storage = module
  })

  it("can be imported", async () => {
    assert.notEqual(storage, undefined)
    assert.notEqual(storage, null)
  });

  it("can store values", async () => {
    const key = "hello"
    const value = "world"
    storage.setString(key, value)
    const storedValue = storage.getString(key)
    assert.equal(storedValue, value)
  });

  it("can expire values after certain duration", async () => {
    const key = "hello"
    const value = "world"
    const expireIn = 1
    storage.setString(key, value, expireIn)
    await new Promise(res => setTimeout(res, 1100))
    const storedValue = storage.getString(key)
    assert.equal(storedValue, null)
  });

  after(async () => {
    storage.stop()
  })
});
