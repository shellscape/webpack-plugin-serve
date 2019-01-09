const test = require('ava');

const { run: runCli } = require('./helpers/runCli');
const { waitForBuild } = require('./helpers/puppeteer');

test('multicompiler should compile successfully', async (t) => {
  const { stderr } = runCli('multi');
  const output = await waitForBuild(stderr);

  t.truthy(output.includes('Child client:'));
  t.truthy(output.includes(' Child worker:'));
});
