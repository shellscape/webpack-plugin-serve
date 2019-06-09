const test = require('ava');

const { defaults } = require('../framework/BundlerServe');
const { validate } = require('../framework/validate');

const { BundlerRouter } = require('../framework/BundlerRouter');
const { BundlerServer } = require('../framework/BundlerServer');

const router = new BundlerRouter();
const server = new BundlerServer(router);

test('defaults', (t) => {
  delete defaults.secure;
  defaults.server = server;
  const result = validate(defaults);
  t.falsy(result.error);
});

test('client', (t) => {
  const result = validate({ client: { address: '0', retry: false, silent: false }, server });
  t.falsy(result.error);
});

test('error', (t) => {
  const result = validate({ foo: 'bar' });
  t.snapshot(result.error);
});

test('promise', (t) => {
  const promise = new Promise(() => {});
  const thenable = { then() {} };
  let result = validate({ host: 0, port: '0', server });
  t.truthy(result.error);
  t.snapshot(result.error);
  result = validate({ host: promise, port: promise, server });
  t.falsy(result.error);
  t.snapshot(result);
  result = validate({ host: thenable, port: thenable, server });
  t.falsy(result.error);
  t.snapshot(result);
});
