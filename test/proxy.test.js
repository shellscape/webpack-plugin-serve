const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');
const defer = require('p-defer');

const { proxyServer } = require('./fixtures/proxy/proxy-server');
const webpackConfig = require('./fixtures/proxy/webpack.config');

const deferred = defer();
const compiler = webpack(webpackConfig);
let watcher;
let server;

test.before('Starting server', async () => {
  server = proxyServer().listen(3003);
  watcher = compiler.watch({}, deferred.resolve);
  await deferred.promise;
});

test.after.always('Closing server', () => {
  server.close();
  watcher.close();
});

test('should reach /api proxy endpoint', async (t) => {
  const response = await fetch('http://localhost:55555/api');
  const result = await response.text();
  t.snapshot(result);
});

test('should reach /api/test proxy endpoint', async (t) => {
  const response = await fetch('http://localhost:55555/api/test');
  const result = await response.text();
  t.snapshot(result);
});
