/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const convert = require('koa-connect');
const historyApiFallback = require('connect-history-api-fallback');
const koaCompress = require('koa-compress');
const koaStatic = require('koa-static');
const onetime = require('onetime');
const httpProxyMiddleware = require('http-proxy-middleware');

const { middleware: wsMiddleware } = require('./ws');

// TODO: add proxy

const getBuiltins = (app, options) => {
  const compress = (opts) => {
    // only enable compress middleware if the user has explictly enabled it
    if (opts || options.compress) {
      app.use(koaCompress(opts || options.compress));
    }
  };

  const historyFallback = () => {
    if (options.historyFallback) {
      app.use(convert(historyApiFallback(options.historyFallback)));
    }
  };

  const statik = (root) => {
    const paths = [].concat(root || options.static);
    for (const path of paths) {
      app.use(koaStatic(path));
    }
  };

  const websocket = () => app.use(wsMiddleware);

  const proxy = (path, opts) => convert(httpProxyMiddleware(path, opts));

  return {
    compress: onetime(compress),
    historyFallback: onetime(historyFallback),
    static: onetime(statik),
    websocket: onetime(websocket),
    proxy: onetime(proxy)
  };
};

module.exports = { getBuiltins };
