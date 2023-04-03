import storage from '../../dist/index.mjs'

export const methods = {
  set(key, value) {
    return storage.setString(key, value)
  },
  get(key) {
    return storage.getString(key)
  },
  delete(key) {
    return storage.removeString(key)
  },
  close() {
    return storage.stop()
  }
}