## 🍲 Sending Custom Headers for Requests

_(Update: As of v0.9.0, users may set Custom Headers using the `headers` option)_

Occasionally a development environment needs to mirror certain aspects of the production environment. That may mean adding custom headers to each request the server responds to. Thankfully, this is exceptionally straightforward using the [Koa](https://koajs.com) underpinnings and the [`middleware`](https://github.com/shellscape/webpack-plugin-serve#middleware) option.

### Meat and Potatoes

To get started, your `webpack` configuration should already be setup and building successfully without using `webpack-plugin-serve`. Next, let's get the plugin setup for custom headers:

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

If you'd like to vote for a formal option for setting custom headers, please [view this issue](https://github.com/shellscape/webpack-plugin-serve/issues/37) and give it a thumbs up.

### 🍰 Dessert

You deserve some cookies (or biscuits or whatever they're call in your neck of the woods).
