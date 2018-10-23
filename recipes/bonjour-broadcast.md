## 🍲 Bonjour Broadcast

Bonjour is a popular choice for cross-network eventing. On systems or networks where an actor is awaiting an event to perform a particular action, events for `webpack-plugin-serve` can be leveraged to initiate a broadcast.

### Meat and Potatoes

To get started, your `webpack` configuration should already be setup and building successfully without using `webpack-plugin-serve`. Next, you'll need the `bonjour` package installed:

```console
$ npm install bonjour --save-dev
```

Next, let's get the plugin setup, and the events wired up for broadcasting:

```js
const bonjour = require('bonjour')();
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve();
const port = 3000; // or whichever port your services are running on
const type = 'http';

serve.on('listening', () => {
  bonjour.publish({ name: 'Batman is Listening', port, type });
});

module.exports = {
  ...,
  plugins: [serve],
  ...
};
```

There's certainly more than can be done with a `bonjour` broadcasting setup, but that's the bare basics of how to get it working with this plugin.

If you find that your system requires clearing, or unpublishing, pending messages, you might choose to flush them when the process ends:

```js
process.on('exit', () => bonjour.unpublishAll(bonjour.destroy));
```

You'll find far more information on the capabilities of the `bonjour` module [in its documentation](https://www.npmjs.com/package/bonjour).

### 🍰 Dessert

Go forth, and imbibe!
