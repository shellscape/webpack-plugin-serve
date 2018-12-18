const merge = require('webpack-merge');

const baseConfig = require('../commonAssets/webpack.config');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const logLevel = 'silent';

module.exports = merge(baseConfig, {
  plugins: [
    new Serve({
      port: 55556,
      log: { level: logLevel },
      middleware: (app, builtins) => {
        app.use(
          builtins.proxy('/api', {
            logLevel,
            target: 'http://localhost:8888'
          })
        );
        app.use(
          builtins.proxy('/wps', {
            logLevel,
            target: 'http://localhost:8888'
          })
        );
        app.use(
          builtins.proxy('/wp', {
            logLevel,
            target: 'http://localhost:8888'
          })
        );
      }
    })
  ],
  watch: true
});
