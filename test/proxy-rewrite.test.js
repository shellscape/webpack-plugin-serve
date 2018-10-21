/* eslint-disable no-param-reassign */
const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');

const { bootstrapServer } = require('./helpers/dummyServer');
const webpackConfig = require('./fixtures/proxy-rewrite/webpack.config');

let targetServer;
let webpackCompiler = webpack(webpackConfig);

test.before('Starting server', async () => {
  targetServer = bootstrapServer([
    {
      url: '/test',
      handler: async (ctx) => {
        ctx.body = 'Hello world from test';
      }
    }
  ]).listen(3004);
  webpackCompiler = webpackCompiler.watch();
});

test.after('Closing server', () => {
  targetServer.close();
  webpackCompiler.close();
});

test('Should not return /api body text', async (t) => {
  const response = await fetch('http://localhost:55556/api/test');
  const responseText = await response.text();
  t.is(responseText, 'Hello world from test');
});
