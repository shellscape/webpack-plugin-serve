## Frequently Asked Questions

<!-- toc -->

- [What does _evergreen_ mean?](#what-does-evergreen-mean)
- [What are "vote" issues?](#what-are-vote-issues)
- [The `[::]` URI is odd, what is that?](#the--uri-is-odd-what-is-that)
- [Why doesn't the server default to `localhost`?](#why-doesnt-the-server-default-to-localhost)
- [What does the "Not Found / 404" error mean?](#what-does-the-not-found--404-error-mean)
- [Why does the `static` option default to `compiler.context`?](#why-does-the-static-option-default-to-compilercontext)
- [Why can't I use Node v10.14.x?](#why-cant-i-use-node-v1014x)
- [Why do I have to include `webpack-plugin-serve/client` in the entry?](#why-do-i-have-to-include-webpack-plugin-serveclient-in-the-entry)

<!-- tocstop -->

<!-- NOTE: markdown-toc will render this link malformed. check it each time the toc is generated -->
### What does _evergreen_ mean?

The concept behind an _evergreen_ project is derived from https://www.w3.org/2001/tag/doc/evergreen-web/. As such, this plugin only actively supports the [Active LTS](https://github.com/nodejs/Release#release-schedule) version of Node.js. As quoted from the W3C document, this decision was made:

> 1. Intentionally: to simplify their implementation, reduce resource requirements or meet environmental constraints

Additionally, this decision was made to leverage speed, stability, and platform enhancements (namely in `http`) in the latest Active LTS Node version(s).

Some users will not be able to leverage this plugin either because they cannot upgrade, because they won't upgrade, or because another dependency prevents an upgrade. The author and maintainers of this plugin understand that, and feel that the benefits of supporting only the Active LTS version of Node.js outweigh the detriments.

_**Please Note:** This is not currently a topic for debate or discussion on this repository. Issues which raise the topic will be closed, but will remain unlocked._

### What are "vote" issues?

"Vote" issues give the community and user base the opportunity to voice their opinion about the usefulness of a proposed feature or modification request that the maintainers have chosen not to implement. Maintainers typically have good reason for not accepting such requests, but in the event that enough users deem something useful, it's prudent to take another look. That's where voting comes into play. Vote thresholds for a particular issue are determined by using a number that is roughly 10% of the NPM downloads for the given month that a request is made. If a feature isn't deemed acceptable or widely useful initially, it should meet the criteria of being useful to at least 10% of the user base. Thresholds are never raised, but they can be lowered.

### The `[::]` URI is odd, what is that?

With Node v8+, servers which inherit from [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) will automatically choose an IPv6 hostname when one is not specified. This plugin chooses not to enforce IPv4 when a host is not provided, but rather lets the underlying system behave according to its defaults.

IPv6 can be unfamiliar territory for users, and the rules around IPv6 addresses are rather different than IPv4. According to [Wikipedia](https://en.wikipedia.org/wiki/IPv6_address#Representation):

> The localhost (loopback) address, 0:0:0:0:0:0:0:1, and the IPv6 unspecified address, 0:0:0:0:0:0:0:0, are reduced to ::1 and ::, respectively.

Since `net.Server` uses `0:0:0:0:0:0:0:0` (an unspecified address) by default, the resulting representation is `::`, which is the zero-compressed representation of the unspecified address. Since that's not at all valid in a browser's address bar, and `::` isn't a valid URI in that scope, `::` is represented as `[::]` in URI format. Hence, the URI you see from the server by default looks something like `http://[::]:55555`.

### Why doesn't the server default to `localhost`?

This plugin is used by a plethora of different users with different needs. As soon as `localhost` is made the default, users will inevitably ask for `0.0.0.0`, `127.0.0.0`, etc. In order to avoid the debate entirely, we allow the Node subsystems and [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) to behave in their default manner.

### What does the "Not Found / 404" error mean?

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

Alternative, one can use an array to add multiple paths for static file resolution, and files from those paths will be served from the root. e.g. `{ static: [ process.cwd(), outputPath, ... ]}`.

### Why does the `static` option default to `compiler.context`?

When creating `webpack-plugin-serve`, we drew upon lessons learned from webpack-dev-server and webpack-serve. _It is impossible to cater to the needs of every webpack user._ That was a lesson hard-learned. A logical, best case coverage decision was made to use `compiler.context`. In the event that a configuration is specified, and an output path is not specified in the configuration, the compiler will set the output path to the compiler context. And unless set, the compiler context defaults to the current working directory. Based on experience and user feedback about the defaults (or lack thereof) in webpack-dev-server and webpack-serve, `compiler.context` was chosen the "safest" default.

### Why can't I use Node v10.14.x?

The minor version range for Node v10.14.x contains [a regression](https://github.com/nodejs/node/pull/17806#issuecomment-446213378) which causes `ERR_STREAM_WRITE_AFTER_END` and `Invalid WebSocket frame: RSV1 must be clear` errors when using WebSockets. We've narrowed the issue down to that version range of Node, as 10.13.x is not affected.

### Why do I have to include `webpack-plugin-serve/client` in the entry?


On `webpack-plugin-serve` this file is responsible to control the `Hot Module Replacement`, i.e, the communication between the webpack compiler and the browser. After a change happens on a file, the server is going to send a message to the browser "Hey browser, here are the files you have to hot replace, and here is the new compilation hash". By doing that, the script that you included knows what files changed and handles them to the `webpack` hmr code that exists on the browser too.

This file is also responsible to serve some of the special features we created, the overlays (status and progress).
