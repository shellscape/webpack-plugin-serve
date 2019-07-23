const path = require('path');

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const nodeExternals = require('webpack-node-externals');

const SRC_DIR_CLIENT = path.resolve(__dirname, 'client');
const SRC_DIR_SERVER = path.resolve(__dirname, 'server');
const DIST_DIR = path.resolve(__dirname, 'dist');

const serve = new Serve({
  port: 3000,
  static: [DIST_DIR],
  waitForBuild: true,
  middleware(app) {
    app.use(async (ctx, next) => {
      const renderer = require(path.resolve(DIST_DIR, 'server.js'));
      await renderer(ctx, next);
    });
  }
});

function createConfig(opts) {
  const { name } = opts;
  const isServer = name === 'server';
  const optimize = process.env.NODE_ENV === 'production';

  return {
    name,
    mode: optimize ? 'production' : 'development',
    entry: isServer
      ? { server: [...(optimize ? [] : ['webpack-plugin-serve/client']), './server/main.js'] }
      : { client: [...(optimize ? [] : ['webpack-plugin-serve/client']), './client/index.js'] },
    output: {
      path: DIST_DIR,
      filename: '[name].js',
      libraryTarget: isServer ? 'commonjs2' : 'var'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [SRC_DIR_SERVER, SRC_DIR_CLIENT],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      modules: false,
                      targets: isServer ? { node: 'current' } : '> 0.5%, last 2 versions, not dead'
                    }
                  ],
                  ['@babel/preset-react', { development: !optimize }]
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [isServer ? serve.attach() : serve],
    target: isServer ? 'async-node' : 'web',
    ...(isServer
      ? {
          externals: nodeExternals({
            whitelist: ['webpack-plugin-serve/client']
          })
        }
      : {}),
    watch: !optimize
  };
}

module.exports = [
  createConfig({
    name: 'client'
  }),
  createConfig({
    name: 'server'
  })
];
