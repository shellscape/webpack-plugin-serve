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
const { DefinePlugin, ProgressPlugin } = require('webpack');

const { init: initHmrPlugin } = require('./hmr-plugin');
const { forceError, getLogger } = require('./log');
const { start } = require('./server');
const { validate } = require('./validate');

const defaults = {
  // leave `client` undefined
  // client: null,
  compress: null,
  historyFallback: false,
  hmr: true,
  host: () => null,
  liveReload: false,
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
  constructor(opts = {}) {
    super();

    const valid = validate(opts);

    if (valid.error) {
      forceError('An option was passed to WebpackPluginServe that is not valid');
      throw valid.error;
    }

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
      const { host } = options;
      options.host = () => host;
    }

    if (Number.isInteger(options.port)) {
      const { port } = options;
      options.port = () => port;
    }

    if (!options.static) {
      options.static = [];
    }

    this.app = new Koa();
    this.log = getLogger(options.log || {});
    this.options = options;
    this.compilers = [];
  }

  apply(compiler) {
    this.compiler = compiler;

    // only allow once instance of the plugin to run for a build
    if (instance !== this) {
      return;
    }

    this.hook(compiler);
  }

  // eslint-disable-next-line class-methods-use-this
  attach() {
    const self = this;
    const result = {
      apply(compiler) {
        return self.hook(compiler);
      }
    };
    return result;
  }

  hook(compiler) {
    const { compile, done, invalid, watchClose, watchRun } = compiler.hooks;

    if (!compiler.name && !compiler.options.name) {
      // eslint-disable-next-line no-param-reassign
      compiler.options.name = this.compilers.length.toString();
      this.compilers.push(compiler);
    }

    if (this.options.hmr) {
      initHmrPlugin(compiler, this.log);
    }

    if (!this.options.static.length) {
      this.options.static.push(compiler.context);
    }

    // we do this emit  because webpack caches and optimizes the hooks, so there's no way to detach
    // a listener/hook.
    compile.tap(key, () => this.emit('compile', compiler.name, compiler));
    done.tap(key, (stats) => this.emit('done', stats, compiler));
    invalid.tap(key, (filePath) => this.emit('invalid', filePath, compiler));
    watchClose.tap(key, () => this.emit('close', compiler));

    watchRun.tapPromise(key, async () => {
      if (!this.startPromise) {
        // ensure we're only trying to start the server once
        this.startPromise = start.bind(this)();
        this.startPromise.then(() => newline());
      }

      // wait for the server to startup so we can get our client connection info from it
      await this.startPromise;

      const compilerData = {};

      if (this.compilers.length > 1) {
        compilerData.compilerName = compiler.options.name;
      }

      const defineObject = Object.assign({}, this.options, compilerData);
      const defineData = { ʎɐɹɔosǝʌɹǝs: JSON.stringify(defineObject) };
      const definePlugin = new DefinePlugin(defineData);

      definePlugin.apply(compiler);

      if (this.options.progress) {
        const progressPlugin = new ProgressPlugin((percent, message, misc) => {
          // pass the data onto the client raw. connected sockets may want to interpret the data
          // differently
          this.emit('progress', { percent, message, misc }, compiler);
        });

        progressPlugin.apply(compiler);
      }
    });
  }
}

module.exports = { defaults, WebpackPluginServe };
