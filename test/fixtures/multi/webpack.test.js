const { resolve } = require('path');

const merge = require('webpack-merge');

const baseConfig = require('../commonAssets/webpack.config');

const { WebpackPluginServe } = require('../../../lib');

const serve = new WebpackPluginServe();

const mainConfig = merge(baseConfig, {
  plugins: [serve]
});

module.exports = [
  mainConfig,
  {
    name: 'compiler01',
    context: __dirname,
    entry: ['./worker.js', 'webpack-plugin-serve/client'],
    mode: 'development',
    output: {
      filename: './dist-worker.js',
      path: resolve(__dirname, './output'),
      publicPath: 'output/'
    },
    plugins: [serve.attach()],
    resolve: {
      alias: {
        'webpack-plugin-serve/client': resolve(__dirname, '../../../client')
      }
    }
  }
];
