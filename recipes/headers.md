## Headers
Applies specified custom headers to each request

### Meat and Potatoes
It requires an object containing all the headers and its values!

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

module.exports = {
  ...,
  plugins: [new Serve({
    middleware: (app, builtins) => {
      builtins.headers({
        "x-vv-my-company-correlation-id": "somewierduuidhere"
      })
    }
  })],
  ...
};

```