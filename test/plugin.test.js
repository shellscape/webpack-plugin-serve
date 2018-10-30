const test = require('ava');

const { WebpackPluginServe } = require('../lib');

test('defaults', (t) => {
  const plugin = new WebpackPluginServe();
  t.snapshot(plugin.options);
});
