import storage from '../../dist/plain-mode.mjs'

export const methods = {
  set(key, value) {
    return storage.setString(key, value)
  },
  get(key) {
    return storage.getString(key)
  },
  close() {
    return storage.stop()
  }
}