/* eslint-disable no-param-reassign */
const Koa = require('koa');
const router = require('koa-route');

const app = new Koa();

const defaultRoutes = [
  {
    url: '/api',
    handler: async (ctx) => {
      ctx.body = '/api endpoint';
    }
  },
  {
    url: '/api/test',
    handler: async (ctx) => {
      ctx.body = '/api/test endpoint';
    }
  }
];

const proxyServer = (routes = defaultRoutes) => {
  routes.forEach((route) => {
    app.use(router.get(route.url, route.handler));
  });
  return app;
};

module.exports = {
  proxyServer
};
