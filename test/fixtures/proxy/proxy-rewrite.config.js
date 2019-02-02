const { mergeUniqPlugins } = require('../../helpers/config-merger');
const base = require('../simple/webpack.config');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const logLevel = 'silent';

module.exports = mergeUniqPlugins(base, {
  plugins: [
    new Serve({
      log: { level: logLevel },
      port: 55557,
      middleware: (app, builtins) => {
        app.use(
          builtins.proxy('/api', {
            logLevel,
            target: 'http://localhost:8889',
            pathRewrite: { '^/api': '' }
          })
        );
      }
    })
  ]
});
