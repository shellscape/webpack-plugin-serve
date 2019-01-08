const test = require('ava');

const { defaults } = require('../framework/BundlerServe');
const { validate } = require('../framework/validate');

test('defaults', (t) => {
  delete defaults.secure;
  // these three need to be removed while the framework is still in the WPS repo. once we move it,
  // remove the following three deletes
  delete defaults.bundler;
  delete defaults.log.name;
  delete defaults.log.symbols;

  const result = validate(defaults);
  t.falsy(result.error);
});

test('error', (t) => {
  const result = validate({ foo: 'bar' });
  t.snapshot(result.error);
});

test('promise', (t) => {
  const promise = new Promise(() => {});
  const thenable = { then() {} };
  let result = validate({ host: 0, port: '0' });
  t.truthy(result.error);
  t.snapshot(result.error);
  result = validate({ host: promise, port: promise });
  t.falsy(result.error);
  t.snapshot(result);
  result = validate({ host: thenable, port: thenable });
  t.falsy(result.error);
  t.snapshot(result);
});
