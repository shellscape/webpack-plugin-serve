const { resolve } = require('path');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const logLevel = 'silent';

module.exports = {
  context: __dirname,
  entry: ['./app.js', 'webpack-plugin-serve/client'],
  mode: 'development',
  output: {
    filename: './output.js',
    path: resolve(__dirname, './output'),
    publicPath: 'output/'
  },
  plugins: [
    new Serve({
      log: { level: logLevel },
      middleware: (app, builtins) => {
        app.use(
          builtins.proxy('/api', {
            logLevel,
            target: 'http://localhost:3003'
          })
        );
        app.use(
          builtins.proxy('/wps', {
            logLevel,
            target: 'http://localhost:3003'
          })
        );
        app.use(
          builtins.proxy('/wp', {
            logLevel,
            target: 'http://localhost:3003'
          })
        );
      }
    })
  ],
  resolve: {
    alias: {
      'webpack-plugin-serve/client': resolve(__dirname, '../../../lib/client')
    }
  },
  watch: true
};
