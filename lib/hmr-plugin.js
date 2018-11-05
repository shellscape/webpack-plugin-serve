const { HotModuleReplacementPlugin } = require('webpack');

const chunkFilename = 'wps-hmr.js';
const mainFilename = 'wps-hmr.json';

const addPlugin = (compiler) => {
  const hmrPlugin = new HotModuleReplacementPlugin();
  // eslint-disable-next-line no-param-reassign
  compiler.options.output = Object.assign(compiler.options.output, {
    hotUpdateChunkFilename: chunkFilename,
    hotUpdateMainFilename: mainFilename
  });
  hmrPlugin.apply(compiler);
};

const hookPlugin = (compiler) => {
  const makePattern = (assetName) =>
    new RegExp(assetName.replace(/\[\w+\]/g, '(\\w+)').replace(/\./g, '\\.'));

  compiler.hooks.compilation.tap('wps', (compilation) => {
    compilation.hooks.additionalChunkAssets.intercept({
      register: (hook) => {
        if (hook.name === 'HotModuleReplacementPlugin') {
          const og = hook.fn;
          // eslint-disable-next-line no-param-reassign
          hook.fn = (...args) => {
            const { assets } = compilation;
            const { hotUpdateChunkFilename, hotUpdateMainFilename } = compiler.options.output;
            const chunkPattern = makePattern(hotUpdateChunkFilename);
            const mainPattern = makePattern(hotUpdateMainFilename);

            for (const assetName of Object.keys(assets)) {
              if (chunkPattern.test(assetName)) {
                assets[chunkFilename] = assets[assetName];
                delete assets[assetName];
              } else if (mainPattern.test(assetName)) {
                assets[mainFilename] = assets[assetName];
                delete assets[assetName];
              }
            }

            const result = og(...args);

            return result;
          };
        }
        return hook;
      }
    });
  });
};

const init = (compiler) => {
  const hasHMRPlugin = compiler.options.plugins.some(
    (plugin) => plugin instanceof HotModuleReplacementPlugin
  );
  if (!hasHMRPlugin) {
    addPlugin(compiler);
    return;
  }
  this.log.warn(
    'webpack-plugin-serve adds HotModuleReplacementPlugin automatically. Please remove it from your config.'
  );

  hookPlugin(compiler);
};

module.exports = { init };
