const { resolve } = require('path');

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const smp = new SpeedMeasurePlugin();

const config = {
  context: __dirname,
<<<<<<< HEAD
  entry: ['./app.js'],
=======
  entry: ['./src/index.js'],
>>>>>>> misc: update benchmark folder with more modules
  mode: 'development',
  output: {
    filename: './output.js',
    path: resolve(__dirname, './output'),
    publicPath: 'output/'
<<<<<<< HEAD
=======
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
>>>>>>> misc: update benchmark folder with more modules
  }
};

if (process.env.SERVER_NAME === 'wps') {
  config.plugins = [new Serve()];
  config.watch = true;
}

module.exports = smp.wrap(config);
