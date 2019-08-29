## 🍲 Built-in Middleware

Built-in middleware provides access to all of the underlying middleware that the plugin uses internally. This provides users with a maximum amount of control over behavior of the server when leveraging the `middleware` option.

### Meat and Potatoes

To leverage built-in middleware, the available middleware methods need but be called with corresponding parameters from the [`Options`](../README.md#options) list. For example, if we were to want to use the `static` middleware, we'd call `builtins.static` with parameters that matched the [`static`](../README.md#static) option:

```js
// webpack.config.js
module.exports = {
  plugins: [
    new WebpackPluginServe({
      middleware: (app, builtins) =>
				const glob = [
					'dist/**/public',
					'dist/app/*'
				];
        builtins.static({ glob });
    })
  ]
};
```

_Note: There is not need to interact with `app`. The underlying method takes care of wiring up to `app.use`._

The same holds true for all of the available built-in middleware methods, except for `builtins.proxy`, which we'll cover in Dessert below. Currently supported built-in middleware that are available on the `builtins` parameter are:

`compress` → forwards to [koa-compress](https://github.com/koajs/compress)<br>
`four0four` → handles requests that result in a 404 status<br>
`headers` → applies specified custom headers to each request<br>
`historyFallback` → forwards to [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback/)<br>
`proxy` → forwards to [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)<br/>
`static` → forwards to [koa-static](https://github.com/koajs/static)<br>
`websocket` → Custom middleware that provides `WebSocket` support

### 🍰 Dessert

The same patterns hold true for every built-in middleware, except for `proxy`. The `proxy` middleware is a special case, because it's very likely that users will want to add that to the `app` as they see fit, and possibly multiple times. For more proxy information, please see [Proxying](../README.md#static) in the README, or the [proxies recipe](../README.md#static).
