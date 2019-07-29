const test = require('ava');

const { PluginExistsError, WebpackPluginServeError } = require('../lib/errors');

test('errors', (t) => {
  t.snapshot(new PluginExistsError());
  t.snapshot(new WebpackPluginServeError());
});
