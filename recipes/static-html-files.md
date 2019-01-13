## Static HTML Files

When setting up an HTML file to bootstrap a Single Page Application users typically choose between two popular options:

1. [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
1. A static HTML file

This recipe addresses setting up a static HTML file, rather than using a plugin to generate an HTML file to serve a bundle.

### Meat and Potatoes

To get started, your `webpack` configuration should be setup and building successfully. Once that's done, you'll need to create an HTML file somewhere in your project directory structure. Be sure to place the file _outside of the `output` directory_. 

Let's use the following directory structure as an example:

```
/the-app
  |_ dist
  |_ js
    |_ app.js
  |_ static
    |_ index.html
```

Where `/the-app/dist` is the `output` webpack output directory. A configuration for this example setup would then resemble the following:

```js
const path = require('path');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const outputPath = path.resolve('./dist');

module.exports = {
  entry: ['./js/app.js', 'webpack-plugin-serve/client'],
  output: {
    filename: 'bundle.js'
    path: outputPath
  },
  plugins: [
    new Serve({
      static: [outputPath, path.resolve('./static')]
    })
  ]
}
```

An HTML file for this setup might resemble:

```html
<!doctype>
<html>
  <body>
    <main></main>
    <script src="/bundle.js"></script>
  </body>
</html>
```

### 🍰 Dessert

Webpack provides for a multitude of different output configurations, and your needs will likely vary from the examples in this recipe. The important parts to assert are configured correctly are:

- the `static` path(s) for `WebpackPluginServe. Any path(s) specified will be be accessible from the website root.
- the `output.publicPath` property, which should be set if your build directory is within a directory specified in `static`
- the `src` property for the `<script>` tag in the static HTML file. This needs to point to where the bundle is located, as defined by all other configuration. In this recipe, we're adding the `outputPath` as a static directory, so the bundle is served from the website root.


