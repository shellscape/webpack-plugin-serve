/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
(() => {
  // eslint-disable-next-line no-undef, no-unused-vars
  const options = ʎɐɹɔosǝʌɹǝs;
  const { info, warn } = console;
  const socket = new WebSocket('ws://[::]:55555/wps');

  // prevents ECONNRESET errors on the server
  window.addEventListener('beforeunload', () => socket.close());

  socket.onmessage = (message) => {
    const { action, data } = JSON.parse(message.data);
    switch (action) {
      case 'connected':
        info('⬡ wps: WebSocket connected');
        break;
      case 'invalid':
        info(data);
        break;
      default:
    }
  };

  socket.onclose = () => warn(`⬡ wps: The client WebSocket was closed. Please refresh the page.`);
})();
