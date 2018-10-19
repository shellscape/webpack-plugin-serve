/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

const httpProxyMiddleware = require('http-proxy-middleware');
const koaConnect = require('koa-connect');

function getProxyMiddleware(proxyOptions) {
  if (proxyOptions.context && proxyOptions.target) {
    return httpProxyMiddleware(proxyOptions.context, proxyOptions);
  }
  return null;
}

const proxyHandler = (app, options) => {
  let proxyMiddleware = null;

  if (!Array.isArray(options)) {
    Object.keys(options).forEach((context) => {
      let proxyConfig = options[context];
      if (typeof options[context] === 'string') {
        proxyConfig = {
          context,
          target: options[context]
        };
      } else {
        proxyConfig = {
          ...proxyConfig,
          context
        };
      }
      proxyMiddleware = getProxyMiddleware(proxyConfig);
      if (proxyMiddleware) {
        app.use(koaConnect(proxyMiddleware));
      }
    });
  } else {
    options.forEach((proxyConfig) => {
      app.use(koaConnect(getProxyMiddleware(proxyConfig)));
    });
  }
};

module.exports = proxyHandler;
