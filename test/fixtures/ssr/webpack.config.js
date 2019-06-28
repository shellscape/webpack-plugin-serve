const { resolve } = require('path');

const getPort = require('get-port');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const serve = new Serve({
  host: 'localhost',
  port: getPort({ port: 55555 }),
  waitForBuild: true,
  middleware(app) {
    app.use(async (ctx, next) => {
      const renderer = require(resolve(__dirname, './output/server.js'));
      await renderer(ctx, next);
    });
  }
});

function createConfig(opts) {
  const { name } = opts;
  const isServer = name === 'server';
  return {
    context: __dirname,
    entry: isServer
      ? { server: ['webpack-plugin-serve/client', './server.js'] }
      : { output: ['webpack-plugin-serve/client', './app.js'] },
    mode: 'development',
    target: isServer ? 'node' : 'web',
    output: {
      filename: '[name].js',
      libraryTarget: isServer ? 'commonjs2' : 'var',
      path: resolve(__dirname, './output'),
      publicPath: 'output/'
    },
    plugins: [isServer ? serve.attach() : serve],
    resolve: {
      alias: {
        'webpack-plugin-serve/client': resolve(__dirname, '../../../client')
      }
    },
    watch: true
  };
}

module.exports = [
  createConfig({
    name: 'client'
  }),
  createConfig({
    name: 'server'
  })
];
