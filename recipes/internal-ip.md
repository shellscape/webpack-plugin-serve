## 🍲 Using an Internal IP Address

When on systems or setups which limit use of `localhost`, or in scenarios where the server should listen on the address of the internet-facing interface, the host can be set dynamically. We're going to use the [internal-ip](https://www.npmjs.com/package/internal-ip) module to demonstrate how to set that up with `webpack-plugin-serve`.

### Meat and Potatoes

To get started, your `webpack` configuration should already be setup and building successfully without using `webpack-plugin-serve`. Next, let's get the plugin setup:

```js
const internalIp = require('internal-ip');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

module.exports = {
  ...,
  plugins: [new Serve({
    host: internalIp.v4()
  })],
  ...
};
```

Pretty straight-forward, right? Now, there's lots of magic going on here that users don't need to futz with; the big take-away here is that the `host` option accepts a `Promise` as a value, and `internalIp.v4()` returns a `Promise`. Nothing more there to do! Bueno. Bien. Gut. 好.

_Note: It's worth checking out the docs for `internal-ip`. You'll find that it also supports getting the IPv6 address if you'd rather use that._

### 🍰 Dessert

And there you have it. We have a sample app that will load the IP of the local machine and use that as the server's host. Cheers, and good eating.
