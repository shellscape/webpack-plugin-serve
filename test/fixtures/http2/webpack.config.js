const { resolve } = require('path');

const { ephemeral } = require('tls-keygen');

const getPort = require('get-port');

const { WebpackPluginServe: Serve } = require('../../../lib/');

module.exports = async () => {
  const { cert, key } = await ephemeral({ entrust: false });
  return {
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
        host: 'localhost',
        port: getPort({ port: 55555 }),
        http2: { cert, key }
      })
    ],
    resolve: {
      alias: {
        'webpack-plugin-serve/client': resolve(__dirname, '../../../client')
      }
    },
    watch: true
  };
};
