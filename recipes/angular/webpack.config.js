const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ContextReplacementPlugin } = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve/client');

const outputPath = path.resolve(__dirname, 'dist');
const watch = process.env.SERVE === 'true';

module.exports = {
  entry: {
    polyfills: './src/polyfills.ts',
    main: ['./src/app.ts', 'webpack-plugin-serve/client']
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.scss$/,
        loader: ['raw-loader', 'sass-loader?sourceMap']
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor'
        }
      }
    }
  },
  output: {
    // output directory
    path: outputPath,
    // name of the generated bundle
    filename: '[name].js'
  },
  plugins: [
    new ContextReplacementPlugin(
      /@angular(\\|\/)core(\\|\/)fesm5/,
      path.resolve(__dirname, 'src'),
      {}
    ),
    new FilterWarningsPlugin({
      exclude: /System.import/
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body'
    }),
    new Serve({
      historyFallback: true,
      hmr: false,
      liveReload: true,
      static: [outputPath]
    })
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  watch
};
