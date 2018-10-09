const test = require('ava');
const getPort = require('get-port');
const Koa = require('koa');
const router = require('koa-route');
const defer = require('p-defer');
const WebSocket = require('ws');

const { middleware } = require('../lib/ws');

test('websocket middleware', async (t) => {
  const app = new Koa();
  const port = await getPort();
  const uri = `ws://localhost:${port}/test`;
  const routeDeferred = defer();
  const resultDeferred = defer();

  app.use(middleware);
  app.use(
    router.get('/test', async (ctx) => {
      t.truthy(ctx.ws);

      const socket = await ctx.ws();

      t.truthy(socket);
      routeDeferred.resolve();
    })
  );

  const server = app.listen(port);

  await {
    then(r, f) {
      server.on('listening', r);
      server.on('error', f);
    }
  };

  const socket = new WebSocket(uri);

  socket.on('open', async () => {
    await routeDeferred.promise;
    socket.close();
    resultDeferred.resolve();
  });

  await resultDeferred.promise;
});
