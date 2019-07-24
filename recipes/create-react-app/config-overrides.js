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
        // Changes in servedPath may cause issues here, so this may require
        // modification
        paths.appPublic,
      ],
    };
    config = removeWebpackPlugins(config, env, {
      pluginNames: [
        // client environment needs to be replaced
        'InterpolateHtmlPlugin',
        // client environment needs to be replaced
        'DefinePlugin',
      ],
      verbose: true,
    });
    // the loaders with oneOf at the time of writing are the main webpack loaders
    const loaders = config.module.rules.find(
      rule => Array.isArray(rule.oneOf)
    ).oneOf;
    // Here we're being lazy and just mutating loaders, which could be done in
    // a more verbose manner with an immutable operation.  Note that this will
    // prepend the MiniCssExtractPlugin loader to make it the greediest
    loaders.splice(
      0,
      0,
      // This will have to be customized based on the css support you want
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
          },
          'css-loader',
        ],
      },
    );
    // mutating operation done

    // define clientEnvironment, which is used by a few plugins
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
        paths.appIndexJs,
        //...config.entry,
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
        // Add back removed plugin with new client environment
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, clientEnvironment.raw),
        // Add back removed plugin with new client environment
        new webpack.DefinePlugin(clientEnvironment.stringified),
        // This plugin is currently only configured on production in CRA
        // so we add it for development as well
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].css',
          chunkFilename: 'static/css/[id].css',
        }),
        new Serve(serveOptions),
      ],
      output: {
        // Required until https://github.com/facebook/create-react-app/pull/7259
        // or something like it gets merged
        path: paths.appBuild,
        publicPath: paths.servedPath,
        filename: 'static/js/bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
      },
    }
  },
};
