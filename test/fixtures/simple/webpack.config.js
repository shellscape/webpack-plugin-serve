const { resolve } = require('path');

const getPort = require('get-port');

const { WebpackPluginServe: Serve } = require('../../../lib');

module.exports = {
  context: __dirname,
  entry: ['./app.js', 'webpack-plugin-serve/client'],
  mode: 'development',
  output: {
    filename: './dist-app.js',
    path: resolve(__dirname, './output'),
    publicPath: 'output/'
  },
  resolve: {
    alias: {
      'webpack-plugin-serve/client': resolve(__dirname, '../../../client')
    }
  },
  plugins: [
    new Serve({
      host: 'localhost',
      port: getPort({ port: 55555 })
    })
  ],
  watch: true
};
