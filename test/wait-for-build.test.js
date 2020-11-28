const del = require('del');
const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');
const defer = require('p-defer');

const { getPort } = require('./helpers/port');
const { make } = require('./fixtures/wait-for-build/make-config');

let watcher;
let port;

test.before('Starting server', async () => {
  const deferred = defer();
  port = await getPort();
  const { serve, config } = make(port);
  const compiler = webpack(config);
  watcher = compiler.watch({}, () => {});
  serve.on('listening', deferred.resolve);
  await deferred.promise;
});

test.after.always('Closing server', async () => {
  watcher.close();
  await del('./test/fixtures/waitForBuild/output');
});

test('should wait until bundle is compiled', async (t) => {
  const response = await fetch(`http://localhost:${port}/test`);
  const text = await response.text();
  t.is(text, 'success');
});
