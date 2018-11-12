const test = require('ava');

const { defaults } = require('../lib');
const { validate } = require('../lib/validate');

test('defaults', (t) => {
  delete defaults.secure;
  const result = validate(defaults);
  t.falsy(result.error);
});

test('error', (t) => {
  const result = validate({ foo: 'bar' });
  t.snapshot(result.error);
});
