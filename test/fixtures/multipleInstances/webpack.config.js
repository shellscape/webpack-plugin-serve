const merge = require('webpack-merge');
const getPort = require('get-port');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const baseConfig = require('../commonAssets/webpack.config');

module.exports = merge(baseConfig, {
  plugins: [
    new Serve({
      port: getPort({
        port: 55555
      })
    }),
    new Serve({
      port: getPort({
        port: 55555
      })
    })
  ]
});
