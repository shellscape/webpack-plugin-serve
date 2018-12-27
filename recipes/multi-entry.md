## 🍲 Setting up Multiple entries

When building a multi-page application, in order to optimise code/module reuse across the whole application a multi entry configuration is used and developers want to use all the features webpack have, such as `hot module replacement` when one change any file. 

In order to take advantage of it the client file has to be present on the dependecy tree to detect and propagate those changes. Sometimes developers get confused because they don't know where exactly to include the client file when facing this scenario.

### Meat and Potatoes

Given that your configuration is already configured as multi-entry

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve();

module.exports = {
  entry: {
    landing: './landing.js',
    checkout: './checkout.js',
    worker: './worker.js'
  },
  // ...rest of your config
};
```

### Making the Meal

We'll now add the client script to the entries we'd like to have client-side features added to:

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve();

module.exports = {
  entry: {
    landing: ['./landing.js', 'webpack-plugin-serve/client'],
    checkout: './checkout.js',
    worker: ['./worker.js', 'webpack-plugin-serve/client']
  },
  // ...rest of your config
};
```

Note that we left the client script off of one of the entries. It's not required that _all entries_ have the client script - only those you wish to use the client-side features for.


### 🍰 Dessert

Go forth with a full belly and contentment, for you've enabled client-side goodies for your entries.
