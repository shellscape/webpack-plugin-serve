## 🍲 Sending Custom Headers for Requests

_(Update: As of v0.9.0, users may set Custom Headers using the `headers` option)_

Occasionally a development environment needs to mirror certain aspects of the production environment. That may mean adding custom headers to each request the server responds to. With `webpack-plugin-serve` you have two ways to do that: using [Koa](https://koajs.com) underpinnings or our custom middleware. 

### Meat and Potatoes

To get started, your `webpack` configuration should already be setup and building successfully without using `webpack-plugin-serve`. Next, let's get the plugin setup for custom headers using `koa` options directly:

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

// webpack.config.js
module.exports = {
  plugins: [
    new Serve({
      middleware: (app, builtins) =>
        app.use(async (ctx, next) => {
          await next();
          ctx.set('X-Superhero', 'batman');
        })
    })
  ]
};
```

Notice that we're tapping into the middleware chain to do our thing. In this example, we're adding a `X-Superhero: batman` header via `ctx.set('X-Superhero', 'batman');`. And that's about all there is to it.

Or you could just use a simple `builtin` function we have added. To use this helper you just need an object containing all the headers and its values.

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

// webpack.config.js
module.exports = {
  plugins: [
    new Serve({
      middleware: (app, builtins) =>
        builtins.headers({
          "X-Superhero": "batman"
        })
    })
  ]
};
```

### 🍰 Dessert

You deserve some cookies (or biscuits or whatever they're called in your neck of the woods).
