const { join } = require('path');

const test = require('ava');
const del = require('del');
const execa = require('execa');

const { browser } = require('../helpers/puppeteer');

test('http2 with hmr - single compiler', browser, async (t, page, util) => {
  const { getPort, replace, setup, waitForBuild } = util;
  const fixturePath = await setup('http2', 'http2-hmr');
  const proc = execa('wp', [], { cwd: fixturePath });
  const { stdout, stderr } = proc;
  const port = await getPort(stdout);
  const url = `https://localhost:${port}`;

  await waitForBuild(stderr);
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });

  const componentPath = join(fixturePath, 'component.js');
  const content = `const main = document.querySelector('main'); main.innerHTML = 'test';`;

  await replace(componentPath, content);

  const value = await page.evaluate(() => document.querySelector('main').innerHTML);

  proc.kill('SIGTERM');

  t.is(value, 'test');

  await del(fixturePath);
});
