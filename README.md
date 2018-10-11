[tests]: 	https://img.shields.io/circleci/project/github/shellscape/postcss-less.svg
[tests-url]: https://circleci.com/gh/shellscape/postcss-less

[cover]: https://codecov.io/gh/shellscape/postcss-less/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/postcss-less

[size]: https://packagephobia.now.sh/badge?p=postcss-less
[size-url]: https://packagephobia.now.sh/result?p=postcss-less

[loglevel]: https://githhub.com/pimterry/loglevel
[loglevelpre]: https://github.com/kutuluk/loglevel-plugin-prefix
[methodFactory]: lib/MethodFactory.js
[prefixFactory]: factory/PrefixFactory.js

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

```js
const WebpackPluginServe = require('webpack-plugin-serve');

module.exports = {
  ...
  plugins: [
    new WebpackPluginServe()
  ]
};

```


## Options

### `compress`
Type: `boolean`<br>
Default: `null`

Enables compress middleware (`koa-compress`), serving content "gziped".

### `historyFallback`
Type: `boolean`<br>
Default: `false`

When using the HTML5 History API, the `index.html` page will likely have to be served in place of any 404 responses, specially when developing `SPAs`

### `hmr`
Type: `boolean`<br>
Default: `true`

Enables [`Hot module replacement`](https://webpack.js.org/concepts/hot-module-replacement/) which exchanges, adds or removes modules while the application still running, without the need of a full reload.

### `host`
Type: `string` | `() => string`<br>
Default: `::`

### `port`
Type: `number`<br>
Default: 55555

### `open`
Type: `boolean`<br>
Default: `false`

When enabled, wps in going to open the browser when running.

### `progress`
Type: `boolean`<br>
Default: `true` 

When set to true, enables webpack `ProgressPlugin` and enables a loading overlay which appears everytime a compilation happens.

### `middleware`
Type: `(app: Koa.Application, builtInMiddlewares) => Promise<any>`

E.g: 
```js
module.exports = {
  plugins: [
    new WebpackPluginServe({
      middleware: (app, /* builtInMiddlewares*/) =>
        app.use(async (ctx, next) => {
          ctx.body = 'Hello world';
          await next();
        })
    })
  ]
};
```

Passing a function to it allows end user to manipulate and execute custom middlewares.

### `log`
Type: `Object<{level: LogLevel}>`<br>
LogLevel: `'info'` | `'trace'` | `'debug'` | `'info'` | `'warn'` | `'error'`<br>
Default: `'info'`


### `static`
TODO

### `https`
Type: Object<[Node https options](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)><br>
Default: `null`

### `http2`
Type: `boolean` | [http2 options](https://nodejs.org/api/http2.html#http2_http2_createserver_options_onrequesthandler) | [https2 options](https://nodejs.org/api/http2.html#http2_http2_createsecureserver_options_onrequesthandler)


## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
