const path = require('path');

const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const importFresh = require('import-fresh');
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
      const renderer = importFresh(path.resolve(DIST_DIR, 'server.js'));
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
      ? { server: './server/main.js' }
      : { client: ['./client/index.js', ...(optimize ? [] : ['webpack-plugin-serve/client'])] },
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
    target: isServer ? 'node' : 'web',
    ...(isServer ? { externals: nodeExternals() } : {}),
    watch: !isServer && !optimize
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
