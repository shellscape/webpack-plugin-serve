const { join } = require('path');

const copy = require('cpy');
const mkdir = require('make-dir');
const strip = require('strip-ansi');

const getPort = (stdout) => {
  return {
    then(r, f) {
      stdout.on('data', (data) => {
        const content = strip(data.toString());
        const test = 'Server Listening on: ';
        if (content.includes(test)) {
          r(content.slice(content.lastIndexOf(':') + 1));
        }
      });

      stdout.on('error', f);
    }
  };
};

const setup = async (base, name) => {
  const fixturesPath = join(__dirname, '../fixtures');
  const src = join(fixturesPath, base);
  const dest = await mkdir(join(fixturesPath, `temp-${name}`));
  await copy(`${src}/*`, dest);

  return dest;
};

module.exports = { getPort, setup };
