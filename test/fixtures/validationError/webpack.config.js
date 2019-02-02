const { mergeUniqPlugins } = require('../../helpers/config-merger');

const { WebpackPluginServe: Serve } = require('../../../lib/');

const baseConfig = require('../simple/webpack.config');

module.exports = mergeUniqPlugins(baseConfig, {
  plugins: [
    new Serve({
      foo: 'bar'
    })
  ],
  watch: false
});
