/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const EventEmitter = require('events');
const url = require('url');

const Koa = require('koa');
const open = require('opn');

const { getBuiltins } = require('./builtins');

const defaults = {
  compress: null,
  historyFallback: false,
  host: () => null,
  middleware: () => {},
  open: true,
  port: 55555,
  static: null
};

// TODO: write a proper logger
const { warn } = console;

let instantiated = false;

// TODO: https by default
// TODO: wire up websockets
// TODO: create client script that connects to the websockets
class WebpackPluginServe extends EventEmitter {
  constructor(opts) {
    if (instantiated) {
      // TODO: expand on this error message
      warn('webpack-plugin-serve is only meant to be used once per config');
    }

    instantiated = true;

    super();

    const options = Object.assign({}, defaults, opts);

    if (options.compress === true) {
      options.compress = {};
    }

    // if the user has set this to a string, rewire it as a function
    // host and port are setup like this to allow passing a function for each to the options, which
    // returns a promise
    if (typeof options.host === 'string') {
      options.host = () => options.host;
    }

    if (Number.isInteger(options.port)) {
      const usePort = options.port;
      options.port = () => usePort;
    }

    this.options = options;
  }

  apply(compiler) {
    if (!this.options.static) {
      this.options.static = [compiler.context];
    }

    compiler.hooks.done.tap('WebpackPluginServe', this.start.bind(this));
  }

  async start() {
    const app = new Koa();
    const { host, middleware, port } = this.options;
    const builtins = getBuiltins(app, this.options);
    const useHost = await host(); // eslint-disable-line
    const usePort = await port();

    // allow users to add and manipulate middleware in the config
    await middleware(app, builtins);

    // call each of the builtin middleware. methods are once'd so this has no ill-effects.
    for (const fn of Object.values(builtins)) {
      fn();
    }

    // TODO: use app.callback and setup our own server instance
    const server = app.listen(usePort);
    // TODO: circle back to this when https is enabled
    const protocol = 'http';
    const address = server.address();

    address.hostname = address.address;
    const uri = `${protocol}://${url.format(address)}`;

    warn('\nListening on:', uri);

    if (this.options.open) {
      open(uri, this.options.open === true ? {} : this.options.open);
    }
  }
}

module.exports = { WebpackPluginServe };
