[tests]: 	https://img.shields.io/circleci/project/github/shellscape/webpack-plugin-serve.svg
[tests-url]: https://circleci.com/gh/shellscape/webpack-plugin-serve

[cover]: https://codecov.io/gh/shellscape/webpack-plugin-serve/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/webpack-plugin-serve

[size]: https://packagephobia.now.sh/badge?p=webpack-plugin-serve
[size-url]: https://packagephobia.now.sh/result?p=webpack-plugin-serve

[https]: https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
[http2]: https://nodejs.org/api/http2.html#http2_http2_createserver_options_onrequesthandler
[http2tls]: https://nodejs.org/api/http2.html#http2_http2_createsecureserver_options_onrequesthandler

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

# webpack-plugin-serve

A Webpack development server in a plugin.

## Requirements

`webpack-plugin-serve` is an evergreen module. 🌲

This module requires Node v10+. The client scripts in this module require [browsers which support `async/await`](https://caniuse.com/#feat=async-functions). Users may also choose to compile the client script via an appropriately configured [Babel](https://babeljs.io/) webpack loader for use in older browsers.

## Install

Using npm:

```console
npm install webpack-plugin-serve --save-dev
```

Using yarn:

```console
yarn add webpack-plugin-serve --dev
```

## Usage

Create a `webpack.config.js` file:

```js
const Serve = require('webpack-plugin-serve');
const options = { ... };

module.exports = {
  ...
  plugins: [
    new Serve(options)
  ]
};

```

And run `webpack` in watch mode:

```console
$ npx webpack --watch
```

## Options

### `client`
Type: `Object`<br>
Default: `null`

Sets options specifically for the client script. In most situations this option doesn't need to be modified.

#### Properties

#### `client.address`
Type: `String`

If set, allows for overriding the `WebSocket` address, which corresponds to the server address by default. Values for this option should be in a valid `{host}:{port}` format. e.g. `localhost:433`.

### `compress`
Type: `Boolean`<br>
Default: `false`

If `true`, enables compression middleware which serves files with GZip compression.

### `historyFallback`
Type: `Boolean | Object`<br>
Default: `false`

If `true`, enables History API Fallback via [`connect-history-api-fallback`](https://github.com/bripkens/connect-history-api-fallback). Users may also pass an `options` Object to this property. Please see `connect-history-api-fallback` for details.

This setting can be handy when using the HTML5 History API; `index.html` page will likely have to be served in place of any 404 responses from the server, specially when developing Single Page Applications.

### `hmr`
Type: `boolean`<br>
Default: `true`

If `true`, will enables [`Hot Module Replacement`](https://webpack.js.org/concepts/hot-module-replacement/) which exchanges, adds, or removes modules from a bundle dynamically while the application still running, without the need of a full page reload.

### `host`
Type: `String | Promise`<br>
Default: `::` for IPv6, `127.0.0.1` for IPv4

Sets the host the server should listen from. Users may choose to set this to a `Promise`, or a `Function` which returns a `Promise` for situations in which the server needs to wait for a host to resolve.

### `http2`
Type: `boolean` | [http2 options]() | [https2 options]()

If set, this option will instruct the server to enable HTTP2. Properties for this option should correspond to [HTTP2 options][http2] or [HTTP2 SSL options][http2tls].

### `https`
Type: `Object`
Default: `null`

If set, this option will instruct the server to enable SSL via HTTPS. Properties for this option should correspond to [HTTPS options][https].

### `port`
Type: `Number | Promise`<br>
Default: `55555`

Sets the port on which the server should listen. Users may choose to set this to a `Promise`, or a `Function` which returns a `Promise` for situations in which the server needs to wait for a port to resolve.

### `open`
Type: `boolean`<br>
Default: `false`

If `true`, opens the default browser to the set `host` and `port`. Users may also choose to pass an `Object` containing options for the [`opn`](https://github.com/sindresorhus/opn) module, which is used for this feature.

### `progress`
Type: `boolean`<br>
Default: `true`

If `true`, the module will add a `ProgressPlugin` instance to the `webpack` compiler, and display a progress indicator on the page within the browser.

### `middleware`
Type: `Function`
Default: `(app, builtins) => {}`

Allows users to implement custom middleware, and manipulate the order in which built-in middleware is executed. This method may also return a `Promise` to pause further middleware evaluation until the `Promise` resolves. This property should only be set by users with solid knowledge of Express/Koa style middleware and those which understand the consequences of manipulating the order of built-in middleware.

#### Example

```js
// webpack.config.js
module.exports = {
  plugins: [
    new WebpackPluginServe({
      middleware: (app, builtins) =>
        app.use(async (ctx, next) => {
          ctx.body = 'Hello world';
          await next();
        })
    })
  ]
};
```

### `log`
Type: `String`<br>
Default: `'info'`<br>
Valid Values: `'info' | 'trace' | 'debug' | 'info' | 'warn' | 'error'`

Sets a level for which messages should appear in the console. For example: if `warn` is set, every message at the `warn` and `error` levels will be visible. This module doesn't produce much log output, so this setting is probably not needed.

### `static`
 Type: `String | Array(String)`
Default: `compiler.context`

Sets the directory(s) from which static files will be served. Bundles will be served from the `output` config setting.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
