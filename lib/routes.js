/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const router = require('koa-route');
const stripAnsi = require('strip-ansi');

const prep = (data) => JSON.stringify(data);

const setupRoutes = function setupRoutes() {
  const { app, compiler } = this;
  const connect = async (ctx) => {
    if (ctx.ws) {
      const socket = await ctx.ws();

      socket.compile = (compilerName = '<unknown>') => {
        socket.send(prep({ action: 'compile', data: { compilerName } }));
      };

      socket.done = (stats) => {
        const { errors, hash, warnings } = stats.toJson(stats);

        if (errors.length) {
          const { errors: errs } = stats.toJson(stats);
          socket.send(
            prep({
              action: 'errors',
              data: { errors: errs.slice(0).map((e) => stripAnsi(e)), hash }
            })
          );
          return;
        }

        if (warnings.length) {
          const { warnings: warns } = stats.toJson(stats);
          socket.send(
            prep({
              action: 'warnings',
              data: { warnings: warns.slice(0).map((e) => stripAnsi(e)) }
            })
          );
          return;
        }

        socket.send(prep({ action: 'replace', data: { hash } }));
      };

      socket.invalid = (filePath = '<unknown>') => {
        if (socket.readyState === 3) {
          return;
        }

        const context = compiler.context || compiler.options.context || process.cwd();
        const fileName = filePath.replace(context, '');

        socket.send(prep({ action: 'invalid', data: { fileName } }));
      };

      this.on('compile', socket.compile);
      this.on('done', socket.done);
      this.on('invalid', socket.invalid);

      socket.on('close', () => {
        this.removeListener('compile', socket.compile);
        this.removeListener('done', socket.done);
        this.removeListener('invalid', socket.invalid);
      });

      socket.send(prep({ action: 'connected' }));
    }
  };

  app.use(router.get('/wps', connect));
};

module.exports = { setupRoutes };
