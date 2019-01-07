const { resolve } = require('path');

const execa = require('execa');

const run = (fixtureFolder, cliArgs = []) =>
  execa('wp', cliArgs, {
    cwd: resolve(__dirname, '../fixtures', fixtureFolder)
  });

module.exports = {
  run
};
