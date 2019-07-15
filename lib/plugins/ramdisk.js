/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { sep } = require('path');

const { WebpackPluginRamdisk } = require('webpack-plugin-ramdisk');

const { PluginExistsError } = require('../errors');

const addPlugin = (compiler) => {
  const plugin = new WebpackPluginRamdisk({ name: 'wps' });
  plugin.apply(compiler);
};

const init = function init(compiler, log) {
  const { path } = compiler.options.output;
  const newPath = path
    .split(sep)
    // only take the last three segments of a path
    .slice(-3)
    .join(sep);

  // eslint-disable-next-line no-param-reassign
  compiler.options.output.path = newPath;

  log.info(`Ramdisk enabled`);

  const hasPlugin = compiler.options.plugins.some(
    (plugin) => plugin instanceof WebpackPluginRamdisk
  );

  /* istanbul ignore else */
  if (!hasPlugin) {
    addPlugin(compiler);
  } else {
    log.error(
      'webpack-plugin-serve adds WebpackRamdiskPlugin automatically. Please remove it from your config.'
    );
    throw new PluginExistsError('WebpackRamdiskPlugin exists in the specified configuration.');
  }
};

module.exports = { init };
