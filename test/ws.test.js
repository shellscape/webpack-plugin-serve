const test = require('ava');
const Koa = require('koa');
const router = require('koa-route');
const defer = require('p-defer');
const WebSocket = require('ws');

const { middleware } = require('../lib/ws');

test('websocket middleware', async (t) => {
  const app = new Koa();
  let deferred = defer();

  app.use(middleware);
  app.use(
    router.get('/test', async (ctx) => {
      t.truthy(ctx.ws);

      const socket = await ctx.ws();

      t.truthy(socket);
      deferred.resolve();
    })
  );

  const server = app.listen(0);

  await {
    then(r, f) {
      server.on('listening', r);
      server.on('error', f);
    }
  };

  const address = server.address();
  // eslint-disable-next-line no-unused-vars
  const socket = new WebSocket(`ws://[::]:${address.port}/test`);

  await deferred.promise;

  deferred = defer();

  socket.on('open', () => {
    socket.close();
    deferred.resolve();
  });

  return deferred.promise;
});
