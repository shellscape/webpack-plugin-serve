## External HTML

Developers sometimes face different scenarios while coding and sometimes outputting an index file is unecessary or redudant.

This scenario is usual while developing SPA, where you need a root element on your page to start rendering your application and you have different other custom meta tags.

### Meat and Potatoes

To get started, your `webpack` configuration should be setup and building successfully. Next, have an index file somewhere else, not inside the output folder.

Given the following folder structure:

`/app/index.html`
`/app/js/app.js`
`/app/dist` -> being the output folder.

In your `html`
```html
<!doctype>
<html>
  <body>
    <main></main>
    <script src="/assets/bundle.js"></script>
  </body>
</html>
```

You `webpack` config should be:

```js
const {resolve} = require('fs');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const outputPath = resolve('./dist');

module.exports = {
    entry: ['./js/app.js', 'webpack-plugin-serve/client'],
    output: {
        publicPath: '/assets/',
        path: outputPath,
        filename: 'bundle.js'
    },
    plugins: [
        new Serve({
            static: resolve('./index.html')
        })
    ]
}
```

Pay attention that we are not using `html-webpack-plugin` since our main goal is to not have `webpack` to emit a `.html` file.


### 🍰 Dessert

And there you have it!
