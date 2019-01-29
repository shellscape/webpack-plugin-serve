const path = require('path');

const Koa = require('koa');
const statik = require('koa-static');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const renderer = require(path.resolve(DIST_DIR, 'server.js'));

const app = new Koa();
app.use(renderer);
app.use(statik(DIST_DIR));

app.listen(3000, () => {
  console.log(`Server started at port ${3000}`);
});
