const test = require('ava');

const { run: runCli } = require('./helpers/runCli');

test('multicompiler', async (t) => {
  const { stderr } = await runCli('multi', ['--config', './webpack.test.js']);
  t.truthy(stderr.includes('Build Finished'));
  t.truthy(stderr.includes('Child 0:'));
  t.truthy(stderr.includes('Child 1:'));
});
