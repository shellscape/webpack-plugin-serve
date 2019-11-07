## Four0Four
A middleware that handles requests that result in a 404 status

### Meat and Potatoes
It requires a function that receives the `Koa` context! This function is executed every time the server receives a `404` error.

With this middleware you can for example render a custom 404 page.

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

module.exports = {
  ...,
  plugins: [new Serve({
    middleware: (app, builtins) => {
      builtins.four0four((ctx) => {
          // render Custom error page
          // do something else.
      })
    }
  })],
  ...
};

```

### 🍰 Dessert

You deserve some cookies (or biscuits or whatever they're called in your neck of the woods).
