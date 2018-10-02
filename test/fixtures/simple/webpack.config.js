const { resolve } = require('path');

const { WebpackPluginServe: Serve } = require('../../../lib/');

module.exports = {
  context: __dirname,
  entry: ['./app.js'],
  output: {
    filename: './output.js',
    path: resolve(__dirname)
  },
  plugins: [new Serve()]
};
