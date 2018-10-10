/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { replace } = require('./client-hmr');
const { info, refresh, warn } = require('./client-log');

// eslint-disable-next-line no-undef, no-unused-vars
const options = ʎɐɹɔosǝʌɹǝs;
const { address, secure, progress } = options;
const protocol = secure ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${address}/wps`);

// prevents ECONNRESET errors on the server
window.addEventListener('beforeunload', () => socket.close());

socket.onmessage = (message) => {
  const { action, data } = JSON.parse(message.data);
  switch (action) {
    case 'connected':
      info('WebSocket connected');
      break;
    case 'replace':
      replace(data.hash);
      break;
    case 'warnings':
      warn('The latest build produced warnings:');
      warn(data.warnings);
      break;
    default:
  }
};

socket.onclose = () => warn(`The client WebSocket was closed. ${refresh}`);

if (progress) {
  require('./overlays/loading/loading.js'); //eslint-disable-line
}

if (module.hot) {
  info('Hot Module Replacement is active');
} else {
  warn('Hot Module Replacement is inactive');
}
