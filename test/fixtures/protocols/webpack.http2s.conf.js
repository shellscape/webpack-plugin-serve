const { resolve } = require('path');

const router = require('koa-route');

const baseConf = require('../simple/webpack.config');
const { WebpackPluginServe } = require('../../../lib/index');

module.exports = Object.assign({}, baseConf, {
  plugins: [
    new WebpackPluginServe({
      http2: {
        cert: resolve('./cert.pem'),
        key: resolve('./key.pem')
      },
      middleware: (app) => {
        app.use(
          router.get('/test', (ctx) => {
            // eslint-disable-next-line
            ctx.status = 200;
            // eslint-disable-next-line
            ctx.body = "let's revolutionize all the tools!!!";
          })
        );
      }
    })
  ]
});
