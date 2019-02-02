const webpack = require('webpack');

const { mergeUniqPlugins } = require('../../helpers/config-merger');

const { WebpackPluginServe } = require('../../../lib');

const baseConfig = require('../simple/webpack.config');

module.exports = mergeUniqPlugins(baseConfig, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackPluginServe({
      log: {
        level: 'info',
        timestamp: true
      }
    })
  ]
});
