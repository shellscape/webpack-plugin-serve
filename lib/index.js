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
const { DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin } = require('webpack');

const { getLogger } = require('./log');
const { start } = require('./server');

const defaults = {
  client: null,
  compress: null,
  historyFallback: false,
  hmr: true,
  host: () => null,
  log: { level: 'info' },
  middleware: () => {},
  open: false,
  port: 55555,
  progress: true,
  secure: false,
  static: null,
  status: true
};

const key = 'webpack-plugin-serve';
const newline = () => console.log(); // eslint-disable-line no-console

let instance = null;

// TODO: test this on a multicompiler setup
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

    if (options.historyFallback === true) {
      options.historyFallback = {};
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

    // eslint-disable-next-line no-param-reassign
    compiler.options.output = Object.assign(compiler.options.output, {
      hotUpdateChunkFilename: 'wps-hmr.js',
      hotUpdateMainFilename: 'wps-hmr.json'
    });

    if (this.options.hmr) {
      const hmrPlugin = new HotModuleReplacementPlugin();
      hmrPlugin.apply(compiler);
    }

    const { compile, done, invalid, watchClose, watchRun } = compiler.hooks;

    if (!this.options.static) {
      this.options.static = [compiler.context];
    }

    // we do this emit  because webpack caches and optimizes the hooks, so there's no way to detach
    // a listener/hook.
    compile.tap(key, () => this.emit('compile', compiler.name));
    done.tap(key, (stats) => this.emit('done', stats));
    invalid.tap(key, (filePath) => this.emit('invalid', filePath));
    watchClose.tap(key, () => this.emit('close'));

    watchRun.tapPromise(key, async () => {
      if (!this.listening) {
        await start.bind(this)();
      }

      newline();

      const defineData = { ʎɐɹɔosǝʌɹǝs: JSON.stringify(this.options) };
      const definePlugin = new DefinePlugin(defineData);

      definePlugin.apply(compiler);

      if (this.options.progress) {
        const progressPlugin = new ProgressPlugin((percent, message, misc) => {
          // pass the data onto the client raw. connected sockets may want to interpret the data
          // differently
          this.emit('progress', { percent, message, misc });
        });

        progressPlugin.apply(compiler);
      }
    });
  }
}

module.exports = { WebpackPluginServe };
