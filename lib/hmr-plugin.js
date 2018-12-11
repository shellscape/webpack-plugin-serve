/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
/* eslint no-param-reassign: off */
const { HotModuleReplacementPlugin } = require('webpack');

const chunkPlaceholder = 'wps-hmr.js';
const mainPlaceholder = 'wps-hmr.json';

const addPlugin = (compiler) => {
  const hmrPlugin = new HotModuleReplacementPlugin();
  // eslint-disable-next-line no-param-reassign
  compiler.options.output = Object.assign(compiler.options.output, {
    hotUpdateChunkFilename: chunkPlaceholder,
    hotUpdateMainFilename: mainPlaceholder
  });
  hmrPlugin.apply(compiler);
};

const intercept = (targetHook, targetName, fn) => {
  targetHook.intercept({
    register: (hook) => {
      if (hook.name === targetName) {
        fn(hook, hook.fn);
      }
      return hook;
    }
  });
};

const hookPlugin = (compiler) => {
  const makePattern = (assetName) =>
    new RegExp(`${assetName}$`.replace(/\[\w+\]/g, '(\\w+)').replace(/\./g, '\\.'));

  compiler.hooks.compilation.tap('wps', (compilation) => {
    const { mainTemplate } = compilation;
    const { assetPath, hotBootstrap } = mainTemplate.hooks;
    const { additionalChunkAssets } = compilation.hooks;
    let currentChunk;

    intercept(hotBootstrap, 'JsonpMainTemplatePlugin', (hook, ogFn) => {
      hook.fn = (source, chunk, hash) => {
        currentChunk = chunk;
        return ogFn(source, chunk, hash);
      };
    });

    intercept(assetPath, 'TemplatedPathPlugin', (hook, ogFn) => {
      const chunkTest = `"${chunkPlaceholder}"`;
      const mainTest = `"${mainPlaceholder}"`;

      hook.fn = (path, data) => {
        const { hotUpdateChunkFilename, hotUpdateMainFilename } = compiler.options.output;

        if (path === chunkTest) {
          path = `"${compiler.wpsId}-${currentChunk.id}-${chunkPlaceholder}"`;
          compiler.options.output = Object.assign(compiler.options.output, {
            hotUpdateChunkFilename: path.slice(1, -1),
            oldHotUpdateChunkFilename: hotUpdateChunkFilename
          });
        } else if (path === mainTest) {
          path = `"${compiler.wpsId}-${currentChunk.id}-${mainPlaceholder}"`;
          compiler.options.output = Object.assign(compiler.options.output, {
            hotUpdateMainFilename: path.slice(1, -1),
            oldHotUpdateMainFilename: hotUpdateMainFilename
          });
        }
        return ogFn(path, data);
      };
    });

    intercept(additionalChunkAssets, 'HotModuleReplacementPlugin', (hook, ogFn) => {
      hook.fn = (...args) => {
        const result = ogFn(...args);

        const { assets } = compilation;
        const {
          hotUpdateChunkFilename,
          hotUpdateMainFilename,
          oldHotUpdateChunkFilename,
          oldHotUpdateMainFilename
        } = compiler.options.output;
        const chunkPattern = makePattern(oldHotUpdateChunkFilename);
        const mainPattern = makePattern(oldHotUpdateMainFilename);

        for (const assetName of Object.keys(assets)) {
          if (chunkPattern.test(assetName)) {
            assets[hotUpdateChunkFilename] = assets[assetName];
            delete assets[assetName];
          } else if (mainPattern.test(assetName)) {
            assets[hotUpdateMainFilename] = assets[assetName];
            delete assets[assetName];
          }
        }

        return result;
      };
    });
  });
};

const init = function init(compiler, log) {
  const hasHMRPlugin = compiler.options.plugins.some(
    (plugin) => plugin instanceof HotModuleReplacementPlugin
  );
  if (!hasHMRPlugin) {
    addPlugin(compiler);
  } else {
    log.warn(
      'webpack-plugin-serve adds HotModuleReplacementPlugin automatically. Please remove it from your config.'
    );
  }

  hookPlugin(compiler);
};

module.exports = { init };
