const { mergeUniqPlugins } = require('../../helpers/config-merger');

const { WebpackPluginServe } = require('../../../lib/');

const baseConfig = require('../simple/webpack.config');

const logLevel = 'silent';

module.exports = mergeUniqPlugins(baseConfig, {
  plugins: [
    new WebpackPluginServe({
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
  ]
});
