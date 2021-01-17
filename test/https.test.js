const https = require('https');

const { readFileSync } = require('fs');

const { resolve, join } = require('path');

const http2 = require('http2');

const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');
const defer = require('p-defer');
const del = require('del');

const { WebpackPluginServe } = require('../lib');

const { getPort } = require('./helpers/port');
const webpackDefaultConfig = require('./fixtures/https/webpack.config');

const httpsFixturePath = resolve(__dirname, './fixtures/https');

const startServe = async (serve) => {
  const deferred = defer();
  const compiler = webpack({
    ...webpackDefaultConfig,
    plugins: [serve]
  });
  const watcher = compiler.watch({}, () => {});
  serve.on('listening', deferred.resolve);
  await deferred.promise;
  return watcher;
};

const checkHttpsServed = async (t, serve, port) => {
  const watcher = await startServe(serve);
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  const response = await fetch(`https://localhost:${port}`, { agent });
  watcher.close();
  t.true(response.ok);
};

const checkHttp2Served = async (t, serve, port) => {
  const watcher = await startServe(serve);
  const deferred = defer();
  const client = http2.connect(`https://localhost:${port}`, {
    rejectUnauthorized: false
  });
  client.on('error', (err) => {
    t.fail(err);
    deferred.reject();
  });

  const req = client.request({ ':path': '/' });
  req.on('response', () => {
    t.pass();
    watcher.close();
    client.close();
    deferred.resolve();
  });
  req.on('end', () => {
    client.close();
    deferred.resolve();
  });

  await deferred.promise;
};

test.after.always('remove build output', async () => {
  await del('./test/fixtures/https/output');
});

test('should start https with pem', async (t) => {
  const port = await getPort();
  const key = readFileSync(join(httpsFixturePath, 'localhost.key'));
  const cert = readFileSync(join(httpsFixturePath, 'localhost.crt'));
  const serve = new WebpackPluginServe({
    host: 'localhost',
    allowMany: true,
    port,
    waitForBuild: true,
    https: { key, cert }
  });

  await checkHttpsServed(t, serve, port);
});

test('should start http2 with pem', async (t) => {
  const port = await getPort();
  const key = readFileSync(join(httpsFixturePath, 'localhost.key'));
  const cert = readFileSync(join(httpsFixturePath, 'localhost.crt'));
  const serve = new WebpackPluginServe({
    host: 'localhost',
    allowMany: true,
    port,
    waitForBuild: true,
    http2: { key, cert }
  });

  await checkHttp2Served(t, serve, port);
});

test('should start https with pfx', async (t) => {
  const port = await getPort();
  const pfx = readFileSync(join(httpsFixturePath, 'localhost.pfx'));
  const serve = new WebpackPluginServe({
    host: 'localhost',
    allowMany: true,
    port,
    waitForBuild: true,
    https: { pfx, passphrase: 'password' }
  });

  await checkHttpsServed(t, serve, port);
});

test('should start http2 with pfx', async (t) => {
  const port = await getPort();
  const pfx = readFileSync(join(httpsFixturePath, 'localhost.pfx'));
  const serve = new WebpackPluginServe({
    host: 'localhost',
    allowMany: true,
    port,
    waitForBuild: true,
    http2: { pfx, passphrase: 'password' }
  });

  await checkHttp2Served(t, serve, port);
});
