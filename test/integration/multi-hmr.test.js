const { join } = require('path');

const test = require('ava');
const del = require('del');
const execa = require('execa');

const { browser } = require('../helpers/puppeteer');

test('multi compiler', browser, async (t, page, util) => {
  const { getPort, replace, setup, waitForBuild } = util;
  const fixturePath = await setup('multi', 'multi-hmr');
  const { stdout, stderr } = execa('wp', [], { cwd: fixturePath });
  const port = await getPort(stdout);
  const url = `http://localhost:${port}`;

  await waitForBuild(stderr);
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });

  const componentPath = join(fixturePath, 'component.js');
  const workerPath = join(fixturePath, 'work.js');
  const componentContent = `const main = document.querySelector('main'); main.innerHTML = 'test';`;
  const workerContent = `const worker = document.querySelector('#worker'); worker.innerHTML = 'test';`;

  await replace(componentPath, componentContent);
  await replace(workerPath, workerContent);

  const componentValue = await page.evaluate(() => document.querySelector('main').innerHTML);
  const workValue = await page.evaluate(() => document.querySelector('#worker').innerHTML);

  t.is(componentValue, 'test');
  t.is(workValue, 'test');

  await del(fixturePath);
});
