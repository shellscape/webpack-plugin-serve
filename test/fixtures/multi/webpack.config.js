const { resolve } = require('path');

const { WebpackPluginServe } = require('../../../lib/');

const serve = new WebpackPluginServe();

module.exports = [
  {
    context: __dirname,
    entry: ['./app.js', 'webpack-plugin-serve/client'],
    mode: 'development',
    output: {
      filename: './dist-app.js',
      path: resolve(__dirname, './output'),
      publicPath: 'output/'
    },
    plugins: [serve],
    resolve: {
      alias: {
        'webpack-plugin-serve/client': resolve(__dirname, '../../../client')
      }
    },
    watch: true
  },
  {
    context: __dirname,
    entry: ['./worker.js'],
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
