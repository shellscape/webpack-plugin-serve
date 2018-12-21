const test = require('ava');

const { run: runCli } = require('./helpers/runCli');

test('Should throw a PluginExistsError', async (t) => {
  const errors = await t.throwsAsync(runCli('./multiHmr'));
  t.truthy(
    errors.message.includes(
      'webpack-plugin-serve adds HotModuleReplacementPlugin automatically. Please remove it from your config'
    )
  );
  t.truthy(
    errors.message.includes(
      'PluginExistsError: HotModuleReplacementPlugin exists in the specified configuration.'
    )
  );
});
