# AssemblyScript Hot Storage

A simple local hot data storage.

# Usage

Initialisation

1. If you are using CommonJS
```js
const getStorage = require('as-hot-storage');
// storage is null, must be initialised with the async getter function
storage = null;

async function initializeStorage() {
  storage = await getStorage();
}
```

2. If you are using ESM
```js
import storage from 'as-hot-storage';
// storage can be used right away
```

```js
// set string, similar with setInt and setFloat
storage.setString("key", "value")
storage.setString("key", "value", 5 /* expires in 5 seconds */)

// set string: throws error for incompatible type
storage.setString("someKey", "hello")
storage.setInt("someKey", 5)
// throws error because "someKey" was set as string before and it has not expired


// get value, similar with getInt and getFloat
storage.getString("key")
// throws error of key is not the correct type


// remove value, similar with removeInt and removeFloat
storage.removeString("key")
storage.getString("key") // === null
```