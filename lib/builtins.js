const convert = require('koa-connect');
const historyApiFallback = require('connect-history-api-fallback');
const koaCompress = require('koa-compress');
const koaStatic = require('koa-static');
const onetime = require('onetime');

// TODO: add proxy

const getBuiltins = (app, options) => {
  const compress = (opts) => {
    // only enable compress middleware if the user has explictly enabled it
    if (opts || options.compress) {
      app.use(koaCompress(opts || options.compress));
    }
  };

  const historyFallback = () => {
    if (options.historyFallback) {
      app.use(convert(historyApiFallback()));
    }
  };

  const statik = (root) => {
    const paths = [].concat(root || options.static);
    for (const path of paths) {
      app.use(koaStatic(path));
    }
  };

  return {
    compress: onetime(compress),
    historyFallback: onetime(historyFallback),
    static: onetime(statik)
  };
};

module.exports = { getBuiltins };
