## 🍲 Opening a Custom URI

The [`open`](https://github.com/shellscape/webpack-plugin-serve#open) option provides users with the ability to instruct the plugin to open the root URI of an application after the server begins listening. In some circumstances users might need to open a custom URI. This can be done relatively quickly.

_Note: `webpack-plugin-serve` endeavors to directly pass-through options for dependencies, rather than wrap custom options sets, parse them, and pass them onto dependencies. Such is the case for the `open` module and the `open` option._

### Meat and Potatoes

To get started, your `webpack` configuration should already be setup and building successfully without using `webpack-plugin-serve`. Next, let's get the plugin setup for opening a custom URI:

```js
const open = require('open');
const { WebpackPluginServe } = require('webpack-plugin-serve');

const serve = new WebpackPluginServe();

// we'll listen for the `listening` event, which tells us the server is up and running
serve.on('listening', () => {
  const uri = 'http://localhost:5555/#/local';
  const opts = {};
  open(uri, opts);
});

// webpack.config.js
module.exports = {
  plugins: [ serve ]
};
```

And that's all there is to it.

### 🍰 Dessert

You deserve some cookies (or biscuits or whatever they're called in your neck of the woods).
