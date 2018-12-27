## 🍲 Setting up Multiple entries

Certain applications or bundles may require several separate entries. Depending on a user's needs, it may be desirable to make Hot Module Replacement, live-reload, or any other client feature available for each entries, or specific entries other than the default. To accomplish that, the `webpack-plugin-serve/client` file must be included with entries on which client features are needed. We'll show you how that should look below.

In order to take advantage of it the client file has to be present on the dependecy tree to detect and propagate those changes. Sometimes developers get confused because they don't know where exactly to include the client file when facing this scenario.

### Meat and Potatoes

Let's say for this example that you have an application which bundles two pages and a web worker separately:

```js


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
