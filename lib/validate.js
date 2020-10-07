/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const {
  refinement,
  any,
  nullable,
  type,
  partial,
  array,
  union,
  number,
  boolean,
  string,
  func,
  literal,
  never,
  validate
} = require('superstruct');
const isPromise = require('is-promise');

const promise = refinement(any(), 'promise-like', (value) => {
  console.log(value, isPromise(value));
  return isPromise(value);
});

const port = refinement(number(), 'port', (value) => Number.isInteger(value) && value <= 65535);

module.exports = {
  validate(options) {
    const schema = partial({
      allowMany: boolean(),
      client: partial({
        address: string(),
        retry: boolean(),
        silent: boolean()
      }),
      compress: nullable(boolean()),
      headers: nullable(type({})),
      historyFallback: union([boolean(), type({})]),
      hmr: boolean(),
      host: nullable(union([promise, string()])),
      http2: union([boolean(), type({})]),
      https: nullable(type({})),
      liveReload: boolean(),
      log: partial({ level: string(), timestamp: boolean() }),
      middleware: func(),
      open: union([boolean(), type({})]),
      port: union([port, promise]),
      progress: union([boolean(), literal('minimal')]),
      ramdisk: union([boolean(), type({})]),
      secure: never(),
      static: nullable(
        union([string(), array(string()), partial({ glob: array(string()), options: type({}) })])
      ),
      status: boolean(),
      waitForBuild: boolean()
    });
    const [error, value] = validate(options, schema);

    return { error, value };
  }
};
