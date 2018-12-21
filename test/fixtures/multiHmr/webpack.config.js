const merge = require('webpack-merge');
const webpack = require('webpack');

const { WebpackPluginServe } = require('../../../lib');

const baseConfig = require('../commonAssets/webpack.config');

module.exports = merge(baseConfig, {
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
