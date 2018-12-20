const { writeFileSync } = require('fs');
const { join } = require('path');

const copy = require('cpy');
const mkdir = require('make-dir');
const puppeteer = require('puppeteer');
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

const browser = async (t, run) => {
  const instance = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await instance.newPage();
  const util = {
    getPort,
    setup,
    replace(path, content) {
      return {
        then(r) {
          // wait for HMR to perform the replacement
          page.on('console', (message) => {
            const text = message.text();
            if (/wps:\sBuild(.+)\sreplaced/.test(text)) {
              // there's some kind of lag betwene puppeteer and ava. this time is somewhat arbitrary
              // but keeps things executing in the right order without failure.
              setTimeout(r, 1000);
            }
          });
          writeFileSync(path, content);
        }
      };
    }
  };
  try {
    await run(t, page, util);
  } finally {
    await page.close();
    await instance.close();
  }
};

module.exports = { browser };
