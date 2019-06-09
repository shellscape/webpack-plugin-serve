/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const nanoid = require('nanoid/generate');
const { DefinePlugin, ProgressPlugin } = require('webpack');

const { BundlerServe } = require('../framework/BundlerServe');
const { BundlerServer } = require('../framework/BundlerServer');

const { WebpackRouter } = require('./WebpackRouter');

const { init: initHmrPlugin } = require('./hmr-plugin');

const key = 'webpack-plugin-serve';
const newline = () => console.log(); // eslint-disable-line no-console

class WebpackPluginServe extends BundlerServe {
  constructor(opts = {}) {
    const router = new WebpackRouter();
    const server = new BundlerServer(router);
    const logDefaults = { level: 'info', name: 'wps', symbols: { ok: '⬡', whoops: '⬢' } };
    const logOptions = Object.assign({}, logDefaults, opts.log);
    const options = Object.assign({}, opts, {
      bundler: {
        className: 'WebpackPluginServe',
        faqUri: 'https://github.com/shellscape/webpack-plugin-serve/blob/master/.github/FAQ.md'
      },
      log: logOptions,
      server
    });

    super(options);
  }

  apply(compiler) {
    this.init();
    this.compiler = compiler;

    // only allow once instance of the plugin to run for a build
    if (this.instance !== this) {
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
    const { done, invalid, watchClose, watchRun } = compiler.hooks;

    if (!compiler.wpsId) {
      // eslint-disable-next-line no-param-reassign
      compiler.wpsId = nanoid('1234567890abcdef', 7);
    }

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

    // we do this emit because webpack caches and optimizes the hooks, so there's no way to detach
    // a listener/hook.
    done.tap(key, (stats) => this.emit('done', stats, compiler));
    invalid.tap(key, (filePath) => this.emit('invalid', filePath, compiler));
    watchClose.tap(key, () => this.emit('close', compiler));

    if (this.options.waitForBuild) {
      // track the first build of the bundle
      this.state.compiling = new Promise((resolve) => {
        this.once('done', () => resolve());
      });

      // track subsequent builds from watching
      this.on('invalid', () => {
        this.state.compiling = new Promise((resolve) => {
          this.once('done', () => resolve());
        });
      });
    }

    compiler.hooks.compilation.tap(key, (compilation) => {
      compilation.hooks.afterHash.tap(key, () => {
        // webpack still has a 4 year old bug whereby in watch mode, file timestamps aren't properly
        // accounted for, which will trigger multiple builds of the same hash.
        // see: https://github.com/egoist/time-fix-plugin
        if (this.lastHash === compilation.hash) {
          return;
        }
        this.lastHash = compilation.hash;
        this.emit('build', compiler.name, compiler);
      });
    });

    watchRun.tapPromise(key, async () => {
      if (!this.state.starting) {
        // ensure we're only trying to start the server once
        this.state.starting = this.start();
        this.state.starting.then(() => newline());
      }

      // wait for the server to startup so we can get our client connection info from it
      await this.state.starting;

      const compilerData = {
        // only set the compiler name if we're dealing with more than one compiler. otherwise, the
        // user doesn't need the additional feedback in the console
        compilerName: this.compilers.length > 1 ? compiler.options.name : null,
        wpsId: compiler.wpsId
      };

      const defineObject = Object.assign({}, this.options, compilerData);

      delete defineObject.server;

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

  /* eslint-disable class-methods-use-this */
}

module.exports = { WebpackPluginServe };
