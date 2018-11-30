/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
/* eslint-disable global-require */
const run = (buildHash, options) => {
  const firstInstance = !!window.webpackPluginServe;

  window.webpackPluginServe = true;

  const { replace } = require('./client-hmr');
  const { error, info, refresh, warn } = require('./client-log');

  const { address, client, progress, secure, status } = options;
  const protocol = secure ? 'wss' : 'ws';
  const socket = new WebSocket(`${protocol}://${(client || {}).address || address}/wps`);

  // prevents ECONNRESET errors on the server
  window.addEventListener('beforeunload', () => socket.close());

  socket.addEventListener('message', (message) => {
    const { action, data } = JSON.parse(message.data);
    const { errors, hash = '<?>', warnings } = data || {};
    const shortHash = hash.slice(0, 7);
    const identifier = options.compilerName ? `(Compiler: ${options.compilerName}) ` : '';

    switch (action) {
      case 'connected':
        info(`WebSocket connected ${identifier}`);
        break;
      case 'errors':
        error(`${identifier}Build ${shortHash} produced errors:\n`, errors);
        break;
      case 'reload':
        window.location.reload();
        break;
      case 'replace':
        replace(hash, buildHash);
        break;
      case 'warnings':
        warn(`${identifier}Build ${shortHash} produced warnings:\n`, warnings);
        break;
      default:
    }
  });

  socket.onclose = () => warn(`The client WebSocket was closed. ${refresh}`);

  if (firstInstance) {
    /* eslint-disable global-require */
    const { init: initProgress } = require('./overlays/progress');
    const { init: initMinimalProgress } = require('./overlays/progress-minimal');
    const { init: initStatus } = require('./overlays/status');

    if (progress === 'minimal') {
      initMinimalProgress(options, socket);
    } else if (progress) {
      initProgress(options, socket);
    }

    if (status) {
      initStatus(options, socket);
    }

    if (module.hot) {
      info('Hot Module Replacement is active');

      if (options.liveReload) {
        info('Live Reload taking precedence over Hot Module Replacement');
      }
    } else {
      warn('Hot Module Replacement is inactive');
    }

    if (!module.hot && options.liveReload) {
      info('Live Reload is active');
    }
  }
};

module.exports = { run };
