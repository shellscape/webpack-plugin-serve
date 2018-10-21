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
      port: 55556,
      middleware: (app, builtins) => {
        app.use(
          builtins.proxy('/api', {
            target: 'http://localhost:3004',
            pathRewrite: { '^/api': '' }
          })
        );
      }
    })
  ],
  resolve: {
    alias: {
      'webpack-plugin-serve/client': resolve(__dirname, '../../../lib/client')
    }
  },
  watch: true
};
