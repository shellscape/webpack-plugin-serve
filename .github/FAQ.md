## Frequently Asked Questions

<!-- toc -->

- [The `[::]` URI is odd, what is that?](#the--uri-is-odd-what-is-that)
- [Why doesn't the server default to `localhost`?](#why-doesnt-the-server-default-to-localhost)
- [What does the "Not Found" error mean?](#what-does-the-not-found-error-mean)
- [Why does the `static` option default to `compiler.context`?](#why-does-the-static-option-default-to-compilercontext)

<!-- tocstop -->

#### The `[::]` URI is odd, what is that?

With Node v8+, servers which inherit from [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) will automatically choose an IPv6 hostname when one is not specified. This plugin chooses not to enforce IPv4 when a host is not provided, but rather lets the underlying system behave according to its defaults.

IPv6 can be unfamiliar territory for users, and the rules around IPv6 addresses are rather different than IPv4. According to [Wikipedia](https://en.wikipedia.org/wiki/IPv6_address#Representation):

> The localhost (loopback) address, 0:0:0:0:0:0:0:1, and the IPv6 unspecified address, 0:0:0:0:0:0:0:0, are reduced to ::1 and ::, respectively.

Since `net.Server` uses `0:0:0:0:0:0:0:0` (an unspecified address) by default, the resulting representation is `::`, which is the zero-compressed representation of the unspecified address. Since that's not at all valid in a browser's address bar, and `::` isn't a valid URI in that scope, `::` is represented as `[::]` in URI format. Hence, the URI you see from the server by default looks something like `http://[::]:55555`.

#### Why doesn't the server default to `localhost`?

This plugin is used by a plethora of different users with different needs. As soon as `localhost` is made the default, users will inevitably ask for `0.0.0.0`, `127.0.0.0`, etc. In order to avoid the debate entirely, we allow the Node subsystems and [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) to behave in their default manner.

#### What does the "Not Found / 404" error mean?

In a nutshell, this means that the static file middleware (`koa-static`) attempted to serve an index file, but couldn't find one. By default, the server will use the path of the webpack compiler `context` property. This error is typically seen when using `HtmlWebpackPlugin` and when the `output` path is different from the `context` (see [this question](#why-does-the-static-option-default-to-compilercontext) for why we use `context`). To remedy this, add your output path to the `static` option when instantiating the plugin. e.g.

```js
// webpack.config.js
const { join } = require('path');
const outputPath = join(process.cwd(), '/dist');
module.exports = {
  ...
  output: {
    path: outputPath
  },
  plugins: [new Serve({ static: outputPath })]
  ...
}
```

Alternative, one can use an array to add multiple paths for static file resolution, and files from those paths will be served from the root. e.g. `{ serve: [ process.cwd(), outputPath, ... ]}`.

#### Why does the `static` option default to `compiler.context`?

When creating `webpack-plugin-serve`, we drew upon lessons learned from webpack-dev-server and webpack-serve. _It is impossible to cater to the needs of every webpack user._ That was a lesson hard-learned. A logical, best case coverage decision was made to use `compiler.context`. In the event that a configuration is specified, and an output path is not specified in the configuration, the compiler will set the output path to the compiler context. And unless set, the compiler context defaults to the current working directory. Based on experience and user feedback about the defaults (or lack thereof) in webpack-dev-server and webpack-serve, `compiler.context` was chosen the "safest" default.
