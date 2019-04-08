const { join } = require('path');

const test = require('ava');

const { WebpackPluginServe } = require('../lib');

test('defaults', (t) => {
  const plugin = new WebpackPluginServe();
  t.snapshot(plugin.options);
});

test('static → glob', (t) => {
  const basePath = join(__dirname, 'fixtures');
  const { options } = new WebpackPluginServe({
    allowMany: true,
    static: [join(basePath, '/**/app.js'), '!**/temp*/*']
  });
  options.static = options.static.map((p) => p.replace(/^.+(serve|project)\//, ''));
  t.snapshot(options.static);
});
