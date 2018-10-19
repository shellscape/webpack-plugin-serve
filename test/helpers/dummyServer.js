/* eslint-disable no-param-reassign */
const Koa = require('koa');
const router = require('koa-route');

const app = new Koa();

const defaultRoutes = [
  {
    url: '/api',
    handler: async (ctx) => {
      ctx.body = 'Hello world 1';
    }
  },
  {
    url: '/api/test',
    handler: async (ctx) => {
      ctx.body = 'Hello world from test';
    }
  }
];

const bootstrapServer = (routes = defaultRoutes) => {
  routes.forEach((route) => {
    app.use(router.get(route.url, route.handler));
  });
  return app;
};

module.exports = {
  bootstrapServer
};
