const { join } = require('path');

const test = require('ava');

const { WebpackPluginServe } = require('../lib');

const reCleanDir = /^.+(serve|project)\//g;
const fixturePath = join(__dirname, 'fixtures').replace(reCleanDir, '');

test('defaults', (t) => {
  const plugin = new WebpackPluginServe();
  t.snapshot(plugin.options);
});

test('static → string', (t) => {
  const { options } = new WebpackPluginServe({
    allowMany: true,
    static: fixturePath
  });
  t.snapshot(options.static);
});

test('static → array(string)', (t) => {
  const { options } = new WebpackPluginServe({
    allowMany: true,
    static: [fixturePath]
  });
  t.snapshot(options.static);
});

test('static → glob', (t) => {
  const { options } = new WebpackPluginServe({
    allowMany: true,
    static: {
      glob: [join(__dirname, 'fixtures')],
      options: { onlyDirectories: true }
    }
  });
  const res = options.static
    .map((p) => p.replace(reCleanDir, ''))
    .filter((p) => !/temp|output/.test(p))
    .sort();
  t.snapshot(res);
});
