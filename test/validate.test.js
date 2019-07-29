const test = require('ava');

const { defaults, WebpackPluginServe } = require('../lib');
const { validate } = require('../lib/validate');

test('defaults', (t) => {
  delete defaults.secure;
  const result = validate(defaults);
  t.falsy(result.error);
});

test('client', (t) => {
  const result = validate({ client: { address: '0', retry: false, silent: false } });
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

test('throws', (t) => {
  const error = t.throws(() => new WebpackPluginServe({ batman: 'nanananana' }));
  t.snapshot(error);
});
