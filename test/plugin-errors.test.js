const test = require('ava');

const { run: runCli } = require('./helpers/runCli');
const { waitForBuild } = require('./helpers/puppeteer');

test('should show an error when having multiple instances of WPS', async (t) => {
  const { stderr } = runCli('multipleInstances');
  const stderrOutput = await waitForBuild(stderr);

  t.truthy(
    stderrOutput.includes(
      'Duplicate instances created. Only the first instance of this plugin will be active.'
    )
  );
});

test('should thow a validation error when giving wrong values', async (t) => {
  try {
    await runCli('validationError');
  } catch (error) {
    t.truthy(
      error.message.includes('An option was passed to WebpackPluginServe that is not valid')
    );
    t.truthy(error.message.includes('ValidationError: "foo" is not allowed'));
  }
});
