const originalSetValuesFunction = Set.prototype.values
Set.prototype.values = function() {
  return [...originalSetValuesFunction.bind(this)()]
}

globalThis.u32 = Number
globalThis.i32 = Number

import {
  setString,
  getString,
  removeString,
  setInt,
  getInt as _getInt,
  removeInt,
  setFloat,
  getFloat as _getFloat,
  removeFloat,
  activeKeysSize,
  activeKeys,
  expiringKeyLoop,
  dump,
} from "./js/index.js";

function wrapNullErrorAsNullForGetFunctions(cb) {
  return (key) => {
    try {
      return cb(key);
    } catch (error) {
      if (error?.message === "null") return null;
      throw error;
    }
  };
}

let interval = setInterval(expiringKeyLoop, 10000);

function stop() {
  clearInterval(interval);
  interval = null;
  return;
}

const getInt = wrapNullErrorAsNullForGetFunctions(_getInt);
const getFloat = wrapNullErrorAsNullForGetFunctions(_getFloat);

export {
  setString,
  getString,
  removeString,
  setInt,
  getInt,
  removeInt,
  setFloat,
  getFloat,
  removeFloat,
  activeKeysSize,
  activeKeys,
  dump,
  stop,
};

export default {
  setString,
  getString,
  removeString,
  setInt,
  getInt,
  removeInt,
  setFloat,
  getFloat,
  removeFloat,
  activeKeysSize,
  activeKeys,
  dump,
  stop,
};
