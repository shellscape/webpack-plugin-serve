const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const removeWebpackPlugins = require('react-app-rewire-unplug');
const { paths } = require('react-app-rewired');

// cra-specific utility functions
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const getClientEnvironment = require('react-scripts/config/env');

module.exports = {
  webpack: (config, env) => {
    if (env !== 'development') {
      // Default to create-react-app
      return config;
    }
    const serveOptions = {
      port: 3000,
      historyFallback: {
        verbose: true,
        index: path.join(paths.servedPath, 'index.html'),
      },
      client: {
        retry: true,
      },
      static: [
        paths.appBuild,
        paths.appPublic,
      ],
    };
    config = removeWebpackPlugins(config, env, {
      pluginNames: [
        // Will be configured by webpack-plugin-serve
        'HotModuleReplacementPlugin',
        // client environment needs to be replaced
        'InterpolateHtmlPlugin',
        // client environment needs to be replaced
        'DefinePlugin',
      ],
      verbose: true,
    });
    const publicUrl = paths.servedPath.replace(/\/$/, '');
    const clientEnvironment = getClientEnvironment(publicUrl);
    const resolve = config.resolve || {};
    const resolveAlias = resolve.alias || {};
    return {
      ...config,
      mode: 'development',
      // Used by webpack-plugin-serve
      watch: true,
      entry: [
        // webpackHotDevClient is removed here; other entries are the same
        ...config.entry,
        'webpack-plugin-serve/client',
      ],
      resolve: {
        ...resolve,
        alias: {
          ...resolveAlias,
          // Adds in hot loader replacements for react-dom for better hmr
          'react-dom': '@hot-loader/react-dom',
        },
      },
      plugins: [
        ...(config.plugins || []),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, clientEnvironment.raw),
        new webpack.DefinePlugin(clientEnvironment.stringified),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
        new Serve(serveOptions),
      ],
      output: {
        // Required until https://github.com/facebook/create-react-app/pull/7259
        // or something like it gets merged
        path: paths.appBuild,
        publicPath: paths.servedPath,
        filename: 'bundle.js',
      },
    }
  },
};
