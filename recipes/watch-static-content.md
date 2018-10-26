## 🍲 Watching Static Content

Watching the static files (or _content_ or _assets_) of your application can be handy. These are typically files that aren't included in your webpack bundle and can be of a variety of uses. The most typical use for watching these files is to reload the app/page when something is added or changed on the filesystem where your static files are located.

_Note: There are many options for utility modules that provide clean interfaces for watching file. For demonstration purposes, we're going to use [`sane`](https://www.npmjs.com/package/sane), which is a clean wrapper around `fs.watch`. Other options include [`chokidar`](https://www.npmjs.com/package/chokidar) and [`fb-watchman`](https://www.npmjs.com/package/fb-watchman)._

### Meat and Potatoes

We're going to assume that you're using a ["zero-config"](https://webpack.js.org/configuration/) setup, in which `webpack` assumes that your bundle entrypoint(s) are located in a `src` directory, and your bundle output will be written to a `dist` directory. So let's setup a `webpack` config file for `webpack-plugin-serve` with that in mind:

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve();

module.exports = {
  mode: 'development',
  plugins: [serve],
  watch: true
};
```

Pretty basic, right? Some important notes about the configuration above:

- `mode: 'development'` is required or else `webpack` will spew forth an annoying warning message on each build/rebuild.
- `watch: true` is required so that `webpack` will enter watch mode. Defining it here means that it doesn't matter [which](https://www.npmjs.com/package/webpack-nano) [CLI](https://www.npmjs.com/package/webpack-command) [you use](https://www.npmjs.com/package/webpack-cli), watch mode will always kick in. This is important to keep `webpack` running as a long-running process. For what it's worth, we recommend [webpack-nano](https://www.npmjs.com/package/webpack-nano).

### Making the Meal

Now that we've got `webpack` building, we need to wire up our watcher. First, install `sane`:

```console
$ npm install sane --save-dev
```

Then let's get our hands dirty and make this do something. We'll assume that your app is located at `/app` and that your static content is located at `/app/assets`. Let's also pretend that you're doing something fancy and relying on Markdown files for some aspect of your app, and that we want the app to reload when one of them changes:

```js
const sane = require('sane');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve({ static: ['/app/assets'] });
const watcher = sane('/app/assets', { glob: [ '**/*.md' ] });

serve.on('listening', () => {
  watcher.on('change', (filePath, root, stat) => {
    console.log('file changed', filePath);
  });
});

serve.on('close', () => watcher.close());

module.exports = {
  mode: 'development',
  plugins: [serve],
  watch: true
};
```

So we've setup our `webpack-plugin-serve` instance to serve static content from `/app/assets`. That's important; otherwise the plugin will just assume the context (in this case the location of `webpack.config.js`) is the root for the static assets.

Next, we've subscribed to two events: `listening`, which fires when the underlying `Koa` server is listening, and `close`, which will fire when `webpack` is done watching files and the process is about to end. The `listening` event fires at the correct time to start watching files. The `close` event is important so that `watcher.close()` can be called and the associated handles cleaned up. Failing to do so may result in funky error messages from Node. So that's all well and good, and we have some console output telling us that a file has changed. Let's switch that up so it's actually making a difference for us:

```js
serve.on('listening', () => {
  watcher.on('change', (filePath, root, stat) => {
    serve.emit('reload', { source: 'config' });
  });
});
```

The important change there is `serve.emit('reload')`. We're including some sugar data there so that any listeners know where the event originated. That could be useful in an app that has multiple instruction points calling for reloads.

### 🍰 Dessert

And there you have it. We have a sample app that will reload whenever Markdown files in the static assets directory changes. Cheers, and good eating.
