/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const nanoid = require('nanoid/generate');
const stripAnsi = require('strip-ansi');
const { DefinePlugin, ProgressPlugin } = require('webpack');

const { BundlerServe } = require('../framework/BundlerServe');

const { init: initHmrPlugin } = require('./hmr-plugin');

const key = 'webpack-plugin-serve';
const newline = () => console.log(); // eslint-disable-line no-console
const statsOptions = {
  all: false,
  cached: true,
  children: true,
  hash: true,
  modules: true,
  timings: true,
  exclude: ['node_modules', 'bower_components', 'components']
};

class WebpackPluginServe extends BundlerServe {
  constructor(...args) {
    super(...args);
    this.options = Object.assign(this.options, {
      bundler: {
        className: 'WebpackPluginServe',
        faqUri: 'https://github.com/shellscape/webpack-plugin-serve/blob/master/.github/FAQ.md'
      },
      log: { level: 'info', name: 'wps', symbols: { ok: '⬡', whoops: '⬢' } }
    });
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
      if (!this.startPromise) {
        // ensure we're only trying to start the server once
        this.startPromise = this.start();
        this.startPromise.then(() => newline());
      }

      // wait for the server to startup so we can get our client connection info from it
      await this.startPromise;

      const compilerData = {
        // only set the compiler name if we're dealing with more than one compiler. otherwise, the
        // user doesn't need the additional feedback in the console
        compilerName: this.compilers.length > 1 ? compiler.options.name : null,
        wpsId: compiler.wpsId
      };

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

  /* eslint-disable class-methods-use-this */
  socketBuild(socket, compilerName = '<unknown>', { wpsId }) {
    socket.send(this.prepSocketData({ action: 'build', data: { compilerName, wpsId } }));
  }

  socketDone(socket, stats, { wpsId }) {
    const { hash } = stats;
    const { options } = this;

    if (socket.lastHash === hash) {
      return;
    }

    socket.send(this.prepSocketData({ action: 'done', data: { hash, wpsId } }));

    // eslint-disable-next-line no-param-reassign
    socket.lastHash = hash;

    const { errors = [], warnings = [] } = stats.toJson(statsOptions);

    if (errors.length || warnings.length) {
      socket.send(
        this.prepSocketData({
          action: 'problems',
          data: {
            errors: errors.slice(0).map((e) => stripAnsi(e)),
            hash,
            warnings: warnings.slice(0).map((e) => stripAnsi(e)),
            wpsId
          }
        })
      );

      return;
    }

    if (options.hmr || options.liveReload) {
      const action = options.liveReload ? 'reload' : 'replace';
      socket.send(this.prepSocketData({ action, data: { hash, wpsId } }));
    }
  }

  socketInvalid(socket, filePath = '<unknown>', compiler) {
    if (socket.readyState === 3) {
      return;
    }

    const context = compiler.context || compiler.options.context || process.cwd();
    const fileName = filePath.replace(context, '');
    const { wpsId } = compiler;

    socket.send(this.prepSocketData({ action: 'invalid', data: { fileName, wpsId } }));
  }
}

module.exports = { WebpackPluginServe };
