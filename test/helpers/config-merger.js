/* eslint-disable no-undefined */
const merge = require('webpack-merge');

const mergeUniqPlugins = merge({
  customizeArray(a, b, key) {
    if (key === 'plugins') {
      return [...b];
    }
    return undefined;
  }
});

module.exports = {
  mergeUniqPlugins
};
