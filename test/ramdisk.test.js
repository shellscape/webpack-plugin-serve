const { existsSync } = require('fs');
const { join } = require('path');

const test = require('ava');
const execa = require('execa');
const strip = require('strip-ansi');

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
  const fixturePath = join(__dirname, 'fixtures/ramdisk');
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
