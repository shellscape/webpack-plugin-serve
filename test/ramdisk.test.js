const { existsSync } = require('fs');
const { join, resolve } = require('path');

const test = require('ava');
const execa = require('execa');
const strip = require('strip-ansi');

const fixturePath = join(__dirname, 'fixtures/ramdisk');

const waitFor = (text, stream) => {
  return {
    then(r, f) {
      stream.on('data', (data) => {
        const content = strip(data.toString());
        if (content.includes(text)) {
          r(content.slice(content.lastIndexOf(text) + text.length));
        }
      });

      stream.on('error', f);
    }
  };
};

test('ramdisk', async (t) => {
  const proc = execa('wp', [], { cwd: fixturePath });
  const { stderr, stdout } = proc;
  const pathTest = 'Build being written to ';
  const doneTest = '[emitted]';

  const path = await waitFor(pathTest, stdout);

  t.regex(path, /(volumes|mnt)\/wps\/[a-f0-9]{32}\/output/i);

  await waitFor(doneTest, stderr);

  const exists = existsSync(join(fixturePath, 'output/output.js'));

  t.truthy(exists);

  proc.kill('SIGTERM');
});

test('ramdisk with options', async (t) => {
  const proc = execa('wp', ['--config', 'ramdisk/custom-options.js'], {
    cwd: resolve(fixturePath, '..')
  });
  const { stderr, stdout } = proc;
  const pathTest = 'Build being written to ';
  const doneTest = '[emitted]';

  const path = await waitFor(pathTest, stdout);

  t.regex(path, /(volumes|mnt)\/wps\/[a-f0-9]{32}\/output/i);

  await waitFor(doneTest, stderr);

  const exists = existsSync(join(fixturePath, 'output/output.js'));

  t.truthy(exists);

  proc.kill('SIGTERM');
});

test('context error', async (t) => {
  try {
    await execa('wp', ['--config', 'ramdisk/config-context-error.js'], {
      cwd: resolve(fixturePath, '..')
    });
  } catch (e) {
    t.regex(e.stderr, /Please set the `context` to a another path/);
    t.is(e.exitCode, 1);
    return;
  }
  t.fail();
});

test('cwd error', async (t) => {
  try {
    await execa('wp', ['--config', '../config-cwd-error.js'], {
      cwd: join(fixturePath, 'cwd-error')
    });
  } catch (e) {
    t.regex(e.stderr, /Please run from another path/);
    t.is(e.exitCode, 1);
    return;
  }
  t.fail();
});
