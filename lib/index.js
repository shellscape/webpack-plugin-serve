/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const EventEmitter = require('events');

const Koa = require('koa');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');

const { getLogger } = require('./log');
const { start } = require('./server');

const defaults = {
  compress: null,
  historyFallback: false,
  hmr: true,
  host: () => null,
  log: { level: 'info' },
  middleware: () => {},
  open: false,
  port: 55555,
  secure: false,
  static: null
};

const key = 'webpack-plugin-serve';
const newline = () => console.log(); // eslint-disable-line no-console

let instance = null;

// TODO: test this on a multicompiler setup
// TODO: https by default
// TODO: wire up websockets
// TODO: create client script that connects to the websockets
class WebpackPluginServe extends EventEmitter {
  constructor(opts) {
    super();

    if (instance) {
      instance.log.error(
        'Duplicate instances created. Only the first instance of this plugin will be active.'
      );
      return;
    }

    instance = this;

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

    this.app = new Koa();
    this.log = getLogger(options.log || {});
    this.options = options;
  }

  apply(compiler) {
    this.compiler = compiler;

    if (instance !== this) {
      return;
    }

    if (this.options.hmr) {
      const hmrPlugin = new HotModuleReplacementPlugin();
      hmrPlugin.apply(compiler);
    }

    const { watchRun } = compiler.hooks;

    if (!this.options.static) {
      this.options.static = [compiler.context];
    }

    watchRun.tapPromise(key, async () => {
      if (!this.listening) {
        await start.bind(this)();
      }

      newline();

      const defineData = { ʎɐɹɔosǝʌɹǝs: JSON.stringify(this.options) };
      const definePlugin = new DefinePlugin(defineData);
      definePlugin.apply(compiler);
    });
  }
}

module.exports = { WebpackPluginServe };
