/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const router = require('koa-route');

/* eslint-disable class-methods-use-this */
class BundlerRouter {
  static prepSocketData(data) {
    return JSON.stringify(data);
  }

  static send(socket, data) {
    if (socket.readyState !== 1) {
      return;
    }
    socket.send(data);
  }

  build(socket, compilerName = '<unknown>') {
    BundlerRouter.send(
      socket,
      BundlerRouter.prepSocketData({ action: 'build', data: { compilerName } })
    );
  }

  // eslint-disable-next-line no-unused-vars
  done(socket) {
    // ABSTRACT: override in consumer
    BundlerRouter.send(
      socket,
      BundlerRouter.prepSocketData({
        action: 'done',
        data: { warning: 'socketDone should be overridden' }
      })
    );
  }

  invalid(socket, filePath = '<unknown>') {
    const fileName = filePath;

    BundlerRouter.send(
      socket,
      BundlerRouter.prepSocketData({ action: 'invalid', data: { fileName } })
    );
  }

  progress(socket, data) {
    BundlerRouter.send(socket, BundlerRouter.prepSocketData({ action: 'progress', data }));
  }

  setup(instance) {
    this.instance = instance;

    const { app } = instance;
    const events = ['build', 'done', 'invalid', 'progress'];
    const connect = async (ctx) => {
      if (ctx.ws) {
        const socket = await ctx.ws();

        for (const event of events) {
          const handler = this[event].bind(this, socket);
          this.instance.on(event, handler);

          socket.on('close', () => {
            this.instance.removeListener(event, handler);
          });
        }

        BundlerRouter.send(socket, BundlerRouter.prepSocketData({ action: 'connected' }));
      }
    };

    app.use(router.get('/wps', connect));
  }
}

module.exports = { BundlerRouter };
