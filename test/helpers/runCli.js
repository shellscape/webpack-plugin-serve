const { resolve } = require('path');

const execa = require('execa');

const webpackNanoBin = resolve(__dirname, '../../node_modules/webpack-nano/bin/wp.js');

const run = (fixtureFolder, cliArgs = ['--config', './webpack.config.js']) =>
  execa('node', [webpackNanoBin].concat(cliArgs), {
    cwd: resolve(__dirname, '../fixtures', fixtureFolder)
  });

module.exports = {
  run
};
