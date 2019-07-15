/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
/* eslint-disable no-param-reassign */
const crypto = require('crypto');
const { existsSync, symlinkSync, unlinkSync } = require('fs');
const { sep } = require('path');

const readPkgUp = require('read-pkg-up');
const { WebpackPluginRamdisk } = require('webpack-plugin-ramdisk');

const { PluginExistsError } = require('../errors');

module.exports = {
  init(compiler) {
    const hasPlugin = compiler.options.plugins.some(
      (plugin) => plugin instanceof WebpackPluginRamdisk
    );

    /* istanbul ignore else */
    if (hasPlugin) {
      this.log.error(
        'webpack-plugin-serve adds WebpackRamdiskPlugin automatically. Please remove it from your config.'
      );
      throw new PluginExistsError('WebpackRamdiskPlugin exists in the specified configuration.');
    }

    const pkg = readPkgUp.sync() || {};
    const { path } = compiler.options.output;
    const lastSegment = path.split(sep).slice(-1);

    if (!pkg.name) {
      // use md5 for a short hash that'll be consistent between wps starts
      const md5 = crypto.createHash('md5');
      md5.update(path);
      pkg.name = md5.digest('hex');
    }

    const newPath = [pkg.name].concat(lastSegment).join(sep);

    // clean up the output path in prep for the ramdisk plugin
    compiler.options.output.path = newPath;

    this.log.info(`Ramdisk enabled`);

    const plugin = new WebpackPluginRamdisk({ name: 'wps' });
    plugin.apply(compiler);

    if (existsSync(path)) {
      unlinkSync(path);
    }
    symlinkSync(compiler.options.output.path, path);
  }
};
