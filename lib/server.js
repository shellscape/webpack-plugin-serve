/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const url = require('url');

const open = require('opn');

const { getBuiltins } = require('./builtins');
const { setupRoutes } = require('./routes');

const newline = () => console.log(); // eslint-disable-line no-console

const start = async function start() {
  if (this.listening) {
    return;
  }

  const { app } = this;
  const { host, middleware, port } = this.options;
  const builtins = getBuiltins(app, this.options);
  const useHost = await host(); // eslint-disable-line
  const usePort = await port();

  // allow users to add and manipulate middleware in the config
  await middleware(app, builtins);

  // call each of the builtin middleware. methods are once'd so this has no ill-effects.
  for (const fn of Object.values(builtins)) {
    fn();
  }

  setupRoutes.bind(this)();

  // TODO: use app.callback and setup our own server instance
  const server = app.listen(usePort);
  this.listening = true;

  // TODO: circle back to this when https is enabled
  const protocol = 'http';
  const address = server.address();

  address.hostname = address.address;
  const uri = `${protocol}://${url.format(address)}`;

  newline();
  this.log.info('Server Listening on:', uri);

  if (this.options.open) {
    open(uri, this.options.open === true ? {} : this.options.open);
  }
};

module.exports = { start };
