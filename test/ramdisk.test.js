const { join } = require('path');

const test = require('ava');
const execa = require('execa');
const strip = require('strip-ansi');

const getPath = (stream) => {
  return {
    then(r, f) {
      stream.on('data', (data) => {
        const content = strip(data.toString());
        const pathTest = 'Build being written to ';
        if (content.includes(pathTest)) {
          r(content.slice(content.lastIndexOf(pathTest) + pathTest.length));
        }
      });

      stream.on('error', f);
    }
  };
};

test('ramdisk', async (t) => {
  const fixturePath = join(__dirname, 'fixtures/ramdisk');
  const proc = execa('wp', [], { cwd: fixturePath });
  const { stdout } = proc;

  const path = await getPath(stdout);

  t.snapshot(path);

  proc.kill('SIGTERM');
});
