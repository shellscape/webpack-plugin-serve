const merge = require('webpack-merge');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const baseConfig = require('../commonAssets/webpack.config');

module.exports = merge(baseConfig, {
  plugins: [new Serve(), new Serve()]
});
