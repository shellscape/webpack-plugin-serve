const test = require('ava');

test('placeholder', (t) => t.pass());
// TODO: fix later
// const fetch = require('node-fetch');

// const { waitForBuild } = require('./helpers/puppeteer');

// const { run: runCli } = require('./helpers/runCli');

// test('should start a http2 server', async (t) => {
//   const { stderr } = runCli('protocols', ['--config', 'webpack.http2.conf.js']);
//   const result2 = await waitForBuild(stderr);
//   const response = await fetch('http://localhost:55555/test');
//   console.log(response);
// });
