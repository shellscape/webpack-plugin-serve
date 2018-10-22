/* eslint-disable no-param-reassign */
const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');
const defer = require('p-defer');

const { proxyServer } = require('./fixtures/proxy/proxy-server');
const webpackConfig = require('./fixtures/proxy/proxy-rewrite.config');

const deferred = defer();
const compiler = webpack(webpackConfig);
let server;
let watcher;

test.before(async () => {
  server = proxyServer([
    {
      url: '/test',
      handler: async (ctx) => {
        ctx.body = '/test endpoint rewrite';
      }
    }
  ]).listen(3004);
  watcher = compiler.watch({}, deferred.resolve);
  await deferred.promise;
});

test.after.always(() => {
  server.close();
  watcher.close();
});

test('should rewrite /api', async (t) => {
  const response = await fetch('http://localhost:55556/api/test');
  const result = await response.text();
  t.snapshot(result);
});
