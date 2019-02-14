import { Configuration } from 'webpack';
import { WebpackPluginServe } from 'webpack-plugin-serve';

const usage = (config: Configuration) => {
  // ← important: this is required, where the magic happens in the browser
  (config.entry as string[]).push('webpack-plugin-serve/client');

  // ← important: webpack and the server will continue to run in watch mode
  config.watch = true;

  config.plugins!.push(
    new WebpackPluginServe({
      compress: true,
      historyFallback: true,
      host: '0.0.0.0',
      port: 3808,
      liveReload: true,
      // set CORS headers
      middleware: (app: any, builtins: any) =>
        app.use(async (ctx: any, next: any) => {
          await next();
          ctx.set('Access-Control-Allow-Headers', '*');
          ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          ctx.set('Access-Control-Allow-Origin', '*');
        }),
      static: '/', // needs to be thet same as the output dir for the html-webpack-plugin

      //
      status: true,
      progress: true,
    }),
  );

  // override the publicPath since production may be set to assets host
  config.output!.publicPath = '/';

  return config;
}
