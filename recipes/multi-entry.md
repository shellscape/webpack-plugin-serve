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
    app1: './app1.js',
    app2: './app2.js',
    app3: './app3.js',
    app4: './app4.js',
  },
  // ...rest of your config
};
```

### Making the Meal

Now that you have your config, let's include the client file on your entries.

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve();

module.exports = {
  entry: {
    app1: ['./app1.js', 'webpack-plugin-serve/client'],
    app2: ['./app2.js', 'webpack-plugin-serve/client'],
    app3: ['./app3.js', 'webpack-plugin-serve/client'],
    app4: ['./app4.js', 'webpack-plugin-serve/client']
  },
  // ...rest of your config
};
```


### 🍰 Dessert

Now you can go home in peace, the next day you are going to have `HMR` enabled for all your entries.
