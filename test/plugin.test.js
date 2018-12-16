const test = require('ava');

const { WebpackPluginServe } = require('../lib');

// allow more than one instance at a time.
process.env.WPS_ENV = 'test';

test('defaults', (t) => {
  const plugin = new WebpackPluginServe();
  t.snapshot(plugin.options);
});

test('non-default', (t) => {
  const plugin = new WebpackPluginServe({
    compress: true,
    historyFallback: true,
    host: '127.0.0.1',
    port: 3124
  });

  t.deepEqual(plugin.options.compress, {});
  t.deepEqual(plugin.options.historyFallback, {});
  t.is(plugin.options.host(), '127.0.0.1');
  t.is(plugin.options.port(), 3124);
});

test('non-defaults with options passed to middlewares', (t) => {
  const plugin = new WebpackPluginServe({
    compress: {
      threshold: 2048
    },
    historyFallback: {
      verbose: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
    },
    port: '3124',
    static: ['/build']
  });

  t.deepEqual(plugin.options.historyFallback, {
    verbose: true,
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
  });
  t.is(plugin.options.compress.threshold, 2048);
  t.is(plugin.options.port, '3124');
});
