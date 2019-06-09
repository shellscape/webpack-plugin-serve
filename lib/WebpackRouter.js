/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
/* eslint-disable class-methods-use-this */
const stripAnsi = require('strip-ansi');

const { BundlerRouter } = require('../framework/BundlerRouter');

const statsOptions = {
  all: false,
  cached: true,
  children: true,
  hash: true,
  modules: true,
  timings: true,
  exclude: ['node_modules', 'bower_components', 'components']
};

const { send, prepSocketData } = BundlerRouter;

class WebpackRouter extends BundlerRouter {
  build(socket, compilerName = '<unknown>', { wpsId }) {
    send(socket, prepSocketData({ action: 'build', data: { compilerName, wpsId } }));
  }

  done(socket, stats, { wpsId }) {
    const { hash } = stats;
    const { options } = this.instance;

    if (socket.lastHash === hash) {
      return;
    }

    send(socket, prepSocketData({ action: 'done', data: { hash, wpsId } }));

    // eslint-disable-next-line no-param-reassign
    socket.lastHash = hash;

    const { errors = [], warnings = [] } = stats.toJson(statsOptions);

    if (errors.length || warnings.length) {
      send(
        prepSocketData({
          action: 'problems',
          data: {
            errors: errors.slice(0).map((e) => stripAnsi(e)),
            hash,
            warnings: warnings.slice(0).map((e) => stripAnsi(e)),
            wpsId
          }
        })
      );

      if (errors.length) {
        return;
      }
    }

    if (options.hmr || options.liveReload) {
      const action = options.liveReload ? 'reload' : 'replace';
      send(socket, prepSocketData({ action, data: { hash, wpsId } }));
    }
  }

  invalid(socket, filePath = '<unknown>', compiler) {
    const context = compiler.context || compiler.options.context || process.cwd();
    const fileName = filePath.replace(context, '');
    const { wpsId } = compiler;

    send(socket, prepSocketData({ action: 'invalid', data: { fileName, wpsId } }));
  }
}

module.exports = { WebpackRouter };
