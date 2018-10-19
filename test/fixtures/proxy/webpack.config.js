const { resolve } = require('path');

const { WebpackPluginServe: Serve } = require('../../../lib/');

module.exports = {
  context: __dirname,
  entry: ['./app.js', 'webpack-plugin-serve/client'],
  mode: 'development',
  output: {
    filename: './output.js',
    path: resolve(__dirname, './output'),
    publicPath: 'output/'
  },
  plugins: [
    new Serve({
      proxy: {
        '/api': 'http://localhost:3003'
      }
    })
  ],
  resolve: {
    alias: {
      'webpack-plugin-serve/client': resolve(__dirname, '../../../lib/client')
    }
  }
};
