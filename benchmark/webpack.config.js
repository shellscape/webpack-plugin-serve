const { resolve } = require('path');

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const smp = new SpeedMeasurePlugin();

const config = {
  context: __dirname,
  entry: ['./app.js'],
  mode: 'development',
  output: {
    filename: './output.js',
    path: resolve(__dirname, './output'),
    publicPath: 'output/'
  }
};

if (process.env.SERVER_NAME === 'wps') {
  config.plugins = [new Serve()];
  config.watch = true;
}

module.exports = smp.wrap(config);
