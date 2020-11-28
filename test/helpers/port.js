const getPort = require('get-port');
const { Random } = require('random-js');

const random = new Random();

module.exports = {
  getPort: () => getPort({ port: random.integer(55000, 55555) })
};
