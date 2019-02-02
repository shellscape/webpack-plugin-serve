const getPort = require('get-port');

const { mergeUniqPlugins } = require('../../helpers/config-merger');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const baseConfig = require('../simple/webpack.config');

module.exports = mergeUniqPlugins(baseConfig, {
  plugins: [
    new Serve({
      port: getPort({
        port: 9999
      })
    }),
    new Serve({
      port: getPort({
        port: 9999
      })
    })
  ]
});
