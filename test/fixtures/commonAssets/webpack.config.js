const { resolve } = require('path');

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
  watch: true
};
