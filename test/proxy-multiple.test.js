/* eslint-disable no-param-reassign */
const webpack = require('webpack');
const test = require('ava');
const fetch = require('node-fetch');

const { bootstrapServer } = require('./helpers/bootstrap-server');
const webpackConfig = require('./fixtures/proxy-multiple/webpack.config');

let targetServer;
let webpackCompiler = webpack(webpackConfig);

test.before('Starting server', async () => {
  targetServer = bootstrapServer([
    {
      url: '/api',
      handler: async (ctx) => {
        ctx.body = 'Hello world 1';
      }
    },
    {
      url: '/api/test',
      handler: async (ctx) => {
        ctx.body = 'Hello world from test';
      }
    },
    {
      url: '/wps',
      handler: async (ctx) => {
        ctx.body = 'Hello world from wps home page';
      }
    },
    {
      url: '/wp',
      handler: async (ctx) => {
        ctx.body = 'Hello world from wp home page';
      }
    }
  ]).listen(3005);
  webpackCompiler = webpackCompiler.watch();
});

test.after('Closing server', () => {
  targetServer.close();
  webpackCompiler.close();
});

test('Should return /api body text', async (t) => {
  const response = await fetch('http://localhost:55558/api');
  const responseText = await response.text();
  t.is(responseText, 'Hello world 1');
});

test('Should return /api/test body text', async (t) => {
  const response = await fetch('http://localhost:55558/api/test');
  const responseText = await response.text();
  t.is(responseText, 'Hello world from test');
});

test('Should return /wps body text', async (t) => {
  const response = await fetch('http://localhost:55558/wps');
  const responseText = await response.text();
  t.is(responseText, 'Hello world from wps home page');
});

test('Should return /wp body text', async (t) => {
  const response = await fetch('http://localhost:55558/wp');
  const responseText = await response.text();
  t.is(responseText, 'Hello world from wp home page');
});
