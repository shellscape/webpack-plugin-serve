const router = require('koa-route');
const merge = require('webpack-merge');

const baseConf = require('../commonAssets/webpack.config');
const { WebpackPluginServe } = require('../../../lib/index');

const plugin = new WebpackPluginServe({
  http2: true,
  middleware: (app) => {
    app.use(
      router.get('/test', (ctx) => {
        // eslint-disable-next-line
        ctx.body = "let's revolutionize all the tools!!!";
      })
    );
  }
});

module.exports = merge(baseConf, {
  plugins: [plugin]
});
