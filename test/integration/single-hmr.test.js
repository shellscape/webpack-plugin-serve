const { join } = require('path');

const test = require('ava');
const del = require('del');
const execa = require('execa');

const { browser } = require('../helpers/puppeteer');

test('single compiler', browser, async (t, page, util) => {
  const { getPort, replace, setup } = util;
  const fixturePath = await setup('simple', 'single-hmr');

  const proc = execa('wp', [], { cwd: fixturePath });

  await {
    then(r) {
      // wait for the build to finish
      setTimeout(r, 1000);
    }
  };

  const { stdout } = proc;
  const port = await getPort(stdout);
  const url = `http://localhost:${port}`;

  await page.goto(url);
  await page.waitForSelector('main');

  const componentPath = join(fixturePath, 'component.js');
  const content = `const main = document.querySelector('main'); main.innerHTML = 'test';`;

  await replace(componentPath, content);

  const value = await page.evaluate(() => document.querySelector('main').innerHTML);

  t.is(value, 'test');

  await del(fixturePath);
});
