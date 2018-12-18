const { writeFileSync } = require('fs');
const { join } = require('path');

const test = require('ava');
const del = require('del');
const execa = require('execa');
const WebSocket = require('ws');

const { browser } = require('../helpers/puppeteer');
const { getPort, setup } = require('../helpers/util');

test('single compiler', browser, async (t, page) => {
  const fixturePath = await setup('simple', 'single-hmr');

  const proc = execa('wp', [], { cwd: fixturePath });

  await {
    then(r) {
      setTimeout(r, 1000);
    }
  };

  const { stdout } = proc;
  const port = await getPort(stdout);
  const url = `http://[::]:${port}`;
  const ws = new WebSocket(`ws://localhost:${port}/wps`);

  await page.goto(url);
  await page.waitForSelector('main');

  const componentPath = join(fixturePath, 'component.js');
  const replace = `const main = document.querySelector('main'); main.innerHTML = 'test';`;

  writeFileSync(componentPath, replace);

  await {
    then(r) {
      ws.on('message', (data) => {
        const { action } = JSON.parse(data);

        if (action === 'replace') {
          setTimeout(r, 1000);
        }
      });
    }
  };

  const value = await page.evaluate(() => document.querySelector('main').innerHTML);

  t.is(value, 'test');

  await del(fixturePath);
});
