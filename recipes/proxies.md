## 🍲 Proxies
Proxying some URLs can be useful when you have an API backend server and you want to send API requests on the same domain or if during development you wan't to simulate the correct urls that are going to work in a real scenario.

Proxying is supported via [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) module but it doesn't contain any fancy options processing for proxying it just provides access directly.

### Meat and Potatoes

To get started, your `webpack` configuration should be setup and building successfully. Next, you have to know which local path you wan't to proxy to which location target. We are going to setup this using the middleware option.

_Note: We assume that the configuration for `webpack-plugin-serve` is the dafault one, i.e, `port:55555` and `host:localhost`_

#### Simple route

We want to proxy our local  urls (`/api`) to `http://localhost:3000`. When a request to `localhost:55555/api` is done, it is going to be proxied to `localhost:3000/api`.

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

module.exports = {
  ...,
  plugins: [new Serve({
    middleware: (app, builtins) => {
      app.use(builtins.proxy('/api', {
        target: 'http://localhost:3000'
      }))
    }
  })],
  ...
};

```

Since `builtins.proxy` gives you access to `http-proxy-middleware`, you can doanything `http-proxy-middleware` accepts.

This will proxy everything from `localhost:55555/api` to `localhost:3000/api`

#### Path Rewrite

Now, let's say you don't want to proxy to the same path that your local path, when requesting to `/api` you want to proxy to `localhost:3000` directly instead. You are looking for one of the `http-proxy-middleware` options that is called `pathRewrite`.

```js
module.exports = {
  ...,
  plugins: [new Serve({
    middleware: (app, builtins) => {
      app.use(builtins.proxy('/api', {
        target: 'http://localhost:3000',
        pathRewrite: {
          '/api': ''
        }
      }))
    }
  })],
  ...
};
```

When you request to `locahost:55555/api` it is going to be proxied to `localhost:3000` instead. Now you don't need to have the prefix `/api` on your target server to make it work.

Simple? Don't you think? You can simply look at [`http-proxy-middleware`](https://github.com/chimurai/http-proxy-middleware) docs if you have any doubts.

### 🍰 Dessert

And there you have it. Now you can proxy a different server into your local domain!
