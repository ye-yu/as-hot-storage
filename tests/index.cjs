const { describe, it, after } = require("node:test");
const { strict: assert } = require("node:assert");
const path = require("path");
const currentDir = path.dirname(__filename);

describe("CommonJS", () => {
  const module = require(path.join(currentDir, "../dist/index.cjs"));

  it("can be imported", async () => {
    assert.notEqual(module, undefined)
    assert.notEqual(module, null)
    assert.equal(typeof module, 'function')

  });

  it("can store values", async () => {
    const key = "hello"
    const value = "world"
    /** @type {import("../dist/index")} */
    const storage = await module()

    storage.setString(key, value)
    const storedValue = storage.getString(key)
    assert.equal(storedValue, value)
  });

  it("can expire values after certain duration", async () => {
    const key = "hello"
    const value = "world"
    const expireIn = 1
    /** @type {import("../dist/index")} */
    const storage = await module()

    storage.setString(key, value, expireIn)
    await new Promise(res => setTimeout(res, 1100))
    const storedValue = storage.getString(key)
    assert.equal(storedValue, null)
  });

  after(async () => {
    const storage = await module()
    storage.stop()
  })
});
