/* eslint-disable no-param-reassign */
const test = require('ava');
const Koa = require('koa');
const router = require('koa-route');
const request = require('supertest');

const { getBuiltins } = require('../lib/middleware');

test('call 404 middleware with a custom handler', async (t) => {
  const app = new Koa();
  const { four0four } = getBuiltins(app, {});
  four0four((ctx) => {
    ctx.body = 'newresult';
    ctx.status = 404;
  });

  const response = await request(app.callback()).get('/');
  t.is(response.text, 'newresult');
  t.is(response.status, 404);
});

test('call 404 middleware with default handler', async (t) => {
  const app = new Koa();
  const { four0four } = getBuiltins(app, {});
  four0four();

  const response = await request(app.callback()).get('/');
  t.truthy(response.text.includes('You may be seeing this error due to misconfigured options.'));
  t.is(response.status, 404);
});

test('should not show a 404 error page', async (t) => {
  const app = new Koa();
  app.use(
    router.get('/test', (ctx) => {
      ctx.status = 200;
      ctx.body = "let's revolutionize all the tools!!!";
    })
  );

  const { four0four } = getBuiltins(app, {});
  four0four();

  const response = await request(app.callback()).get('/test');
  t.is(response.text, "let's revolutionize all the tools!!!");
  t.is(response.status, 200);
});

test('apply compress middleware with default options', async (t) => {
  const app = new Koa();
  app.use(
    router.get('/test', (ctx) => {
      ctx.body = {
        username: 'test123'
      };
    })
  );

  const { compress } = getBuiltins(app, {
    compress: {}
  });
  compress();

  const response = await request(app.callback())
    .get('/test')
    .set('Accept-Encoding', 'gzip')
    .set('Content-Type', 'application/json');
  t.is(response.body.username, 'test123');
});
