const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');

const { bootstrapServer } = require('./helpers/dummyServer');
const webpackConfig = require('./fixtures/proxy/webpack.config');

let targetServer;
let webpackCompiler = webpack(webpackConfig);

test.before('Starting server', async () => {
  targetServer = bootstrapServer().listen(3003);
  webpackCompiler = webpackCompiler.watch();
});

test.after('Closing server', () => {
  targetServer.close();
  webpackCompiler.close();
});

test('Should return /api body text', async (t) => {
  const response = await fetch('http://localhost:55555/api');
  const responseText = await response.text();
  t.is(responseText, 'Hello world 1');
});

test('Should return /api/test body text', async (t) => {
  const response = await fetch('http://localhost:55555/api/test');
  const responseText = await response.text();
  t.is(responseText, 'Hello world from test');
});
