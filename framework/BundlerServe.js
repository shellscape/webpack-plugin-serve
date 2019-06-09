/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const EventEmitter = require('events');

const Koa = require('koa');
const globby = require('globby');

const { fatal, getLogger } = require('./log');
const { validate } = require('./validate');

const defaults = {
  bundler: {
    className: 'BundlerServe',
    faqUri: 'https://github.com/shellscape/bundler-serve/blob/master/.github/FAQ.md'
  },

  // leave `client` undefined
  // client: null,
  compress: null,
  headers: null,
  historyFallback: false,
  hmr: true,
  host: null,
  liveReload: false,
  log: { level: 'info', name: 'bundler', symbols: { ok: '🞎', whoops: '▣' } },
  middleware: () => {},
  open: false,
  port: 55555,
  progress: true,
  secure: false,
  server: null,
  static: null,
  status: true
};

class BundlerServe extends EventEmitter {
  constructor(opts = {}) {
    super();

    const valid = validate(opts);
    const options = Object.assign({}, defaults, opts);
    const { server } = options;

    options.bundler = Object.assign({}, defaults.bundler, opts.bundler);

    if (valid.error) {
      fatal(options, `An option was passed to ${options.bundler.className} that is not valid`);
      throw valid.error;
    }

    // NOTE: undocumented option. this is used primarily in testing to allow for multiple instances
    // of the plugin to be tested within the same context. If you find this, use this at your own
    // peril.
    if (!options.allowMany && this.instance) {
      this.instance.log.error(
        'Duplicate instances created. Only the first instance of this plugin will be active.'
      );
      return;
    }

    if (options.compress === true) {
      options.compress = {};
    }

    if (options.historyFallback === true) {
      options.historyFallback = {};
    }

    // if the user has set this to a string, rewire it as a function
    // host and port are setup like this to allow passing a function for each to the options, which
    // returns a promise
    if (typeof options.host === 'string') {
      const { host } = options;
      options.host = {
        then(r) {
          r(host);
        }
      };
    }

    if (Number.isInteger(options.port)) {
      const { port } = options;
      options.port = {
        then(r) {
          r(port);
        }
      };
    }

    if (!options.static) {
      options.static = [];
    } else if (options.static.glob) {
      const { glob, options: globOptions = {} } = options.static;
      options.static = globby.sync(glob, globOptions);
    }

    this.app = new Koa();
    this.compilers = [];
    this.instance = this;
    this.options = options;
    this.server = server;
    this.state = {};

    server.setup(this);
  }

  init() {
    this.log = getLogger(this.options.log || {});

    if (this.instance !== this) {
      return;
    }

    if (!this.options.static) {
      const error = new TypeError('The value of options.static cannot be null or empty.');
      fatal(this.options, error.message);
      throw error;
    }
  }

  start() {
    if (!this.listening) {
      return this.server.start();
    }

    return false;
  }
}

module.exports = { defaults, BundlerServe };
