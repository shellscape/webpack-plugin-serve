const path = require('path');

const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin');

const { WebpackPluginServe: Serve } = require('../../');

module.exports = {
  mode: 'development',
  entry: ['./src', '../../client'],
  plugins: [
    new Serve({ hmr: 'refresh-on-failure', static: ['./dist'], status: false }),
    new ReactRefreshPlugin({
      overlay: false
    }),
    new MiniHtmlWebpackPlugin({
      context: {
        body: '<div id="app"></div>'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  watch: true
};
