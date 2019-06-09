/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const url = require('url');
const { createServer, ServerResponse } = require('http');

const joi = require('joi');
const open = require('opn');

const { BundlerRouter } = require('./BundlerRouter');
const { getBuiltins } = require('./middleware');

class BundlerServer {
  constructor(router) {
    const { object, validate } = joi.bind();
    const valid = validate(router, object().type(BundlerRouter));

    if (valid.error) {
      throw valid.error;
    }

    this.router = router;
  }

  middleware() {
    const { app, options } = this.instance;
    return getBuiltins(app, options);
  }

  select(callback) {
    const { options } = this.instance;
    /* eslint-disable global-require */
    const types = {
      http: createServer,
      https: require('https').createServer,
      http2: require('http2').createServer,
      http2Secure: require('http2').createSecureServer
    };
    const { http2, https } = options;
    let server;
    let secure = false;

    if (http2) {
      if (http2 === true) {
        server = types.http2({}, callback);
      } else if (http2.cert) {
        secure = true;
        server = types.http2Secure(http2, callback);
      } else {
        server = types.http2(http2, callback);
      }
    } else if (https) {
      secure = true;
      server = types.https(https === true ? {} : https, callback);
    } else {
      server = types.http(callback);
    }

    return { secure, server };
  }

  setup(instance) {
    this.instance = instance;
  }

  async start() {
    if (this.listening) {
      return;
    }

    const { instance } = this;
    const { app, options } = instance;
    const { host, middleware, port, waitForBuild } = options;
    const builtins = this.middleware();

    instance.options.host = await host;
    instance.options.port = await port;

    if (waitForBuild) {
      app.use(async (ctx, next) => {
        await instance.state.compiling;
        await next();
      });
    }

    // allow users to add and manipulate middleware in the config
    await middleware(app, builtins);

    // call each of the builtin middleware. methods are once'd so this has no ill-effects.
    for (const fn of Object.values(builtins)) {
      if (!fn.skip) {
        fn();
      }
    }

    this.router.setup(instance);

    const { secure, server } = this.select(app.callback());
    const emitter = instance;

    instance.options.secure = secure;
    server.listen({ host: instance.options.host, port: instance.options.port });

    // wait for the server to fully spin up before asking it for details
    await {
      then(r, f) {
        server.on('listening', () => {
          emitter.emit('listening', server);
          r();
        });
        server.on('error', f);
      }
    };

    // Node < v10 doesn't send upgrade requests through. This simulates what occurs on
    // on Node >= v10
    if (parseInt(process.versions.node, 10) < 10) {
      server.on('upgrade', (req) => server.emit('request', req, new ServerResponse(req)));
    }

    this.listening = true;

    const protocol = secure ? 'https' : 'http';
    const address = server.address();

    address.hostname = address.address;

    // fix #131 - server address reported as 127.0.0.1 for localhost
    if (address.hostname !== instance.options.host && instance.options.host === 'localhost') {
      address.hostname = instance.options.host;
    }

    // we set this so the client can use the actual hostname of the server. sometimes the net
    // will mutate the actual hostname value (e.g. :: -> [::])
    instance.options.address = url.format(address);

    const uri = `${protocol}://${instance.options.address}`;

    instance.log.info('Server Listening on:', uri);

    instance.once('done', () => {
      if (instance.options.open) {
        open(uri, instance.options.open === true ? {} : instance.options.open);
      }
    });
  }
}

module.exports = { BundlerServer };
