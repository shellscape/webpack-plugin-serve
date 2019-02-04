/* eslint-disable no-param-reassign */
const { resolve } = require('path');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const make = (port) => {
  const outputPath = resolve(__dirname, './output/output.js');
  const serve = new Serve({
    host: 'localhost',
    port,
    waitForBuild: true,
    middleware: (app) => {
      app.use(async (ctx, next) => {
        if (ctx.url === '/test') {
          try {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            require(outputPath);
            ctx.body = 'success';
          } catch (e) {
            ctx.body = 'error';
          }
        }
        await next();
      });
    }
  });

  const config = {
    context: __dirname,
    entry: ['./app.js'],
    mode: 'development',
    output: {
      filename: './output.js',
      path: resolve(__dirname, './output'),
      publicPath: 'output/',
      libraryTarget: 'commonjs2'
    },
    plugins: [serve],
    target: 'node',
    watch: true
  };

  return { serve, config };
};

module.exports = { make };
