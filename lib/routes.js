/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const router = require('koa-route');

const key = 'webpack-plugin-serve';

const prep = (data) => JSON.stringify(data);

const setupRoutes = function setupRoutes() {
  const { app, compiler } = this;
  const { invalid } = compiler.hooks;
  const connect = async (ctx) => {
    if (ctx.ws) {
      const socket = await ctx.ws();

      socket.invalid = (filePath = '<unknown>') => {
        if (socket.readyState === 3) {
          return;
        }

        const context = compiler.context || compiler.options.context || process.cwd();
        const fileName = filePath.replace(context, '');

        socket.send(prep({ action: 'invalid', data: { fileName } }));
      };

      // we do this because webpack caches and optimizes the hooks, so there's no way to detach a
      // listener/hook.
      invalid.tap(key, (filePath) => this.emit('invalid', filePath));

      this.on('invalid', socket.invalid);

      socket.on('close', () => {
        this.removeListener('invalid', socket.invalid);
      });

      socket.send(prep({ action: 'connected' }));
    }
  };

  app.use(router.get('/wps', connect));
};

module.exports = { setupRoutes };
