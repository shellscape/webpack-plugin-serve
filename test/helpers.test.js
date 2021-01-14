const test = require('ava');

const { getMajorVersion } = require('../lib/helpers');

test('Get major version with correct value', (t) => {
  const majorVersion = getMajorVersion('5.2.3');
  t.true(majorVersion === '5');
});

test('Get major version with incorrect value', (t) => {
  const majorVersion = getMajorVersion('5');
  t.true(majorVersion === false);
});
