## 🍲 Using a Dynamic Port

Most of the time using a static, predefined port number will work just fine. There can be situations in which fetching an unused, free port for use with `webpack-plugin-server` can come in handy. We're going to use the [get-port](https://www.npmjs.com/package/get-port) module to demonstrate how that can be set that up with `webpack-plugin-serve`.

### Meat and Potatoes

To get started, your `webpack` configuration should already be setup and building successfully without using `webpack-plugin-serve`. Next, let's get the plugin setup:

```js
const getPort = require('get-port');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

module.exports = {
  ...,
  plugins: [new Serve({
    port: getPort()
  })],
  ...
};
```

Pretty straight-forward, right? Now, there's lots of magic going on here that users don't need to futz with; the big take-away here is that the `port` option accepts a `Promise` as a value, and `getPort` returns a `Promise`. Nothing more there to do! Bueno. Bien. Gut. 好.

_Note: It's worth checking out the docs for `get-port`. You'll find that it accepts a few different options including setting a preferred port that it will default to if the port number is free._

### 🍰 Dessert

And there you have it. We have a sample app that will get an available port number and use that as the server's port. Cheers, and good eating.
