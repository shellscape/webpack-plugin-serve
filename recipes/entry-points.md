## 🍲 Configuring `entry` With webpack-plugin-serve

There are multiple patterns available for configuring the entry point for a `webpack` bundle, and these are [fairly well documented](https://webpack.js.org/concepts/entry-points/). However, adding an additional resource to an entry, as required by `webpack-plugin-serve`, may not be straight-forward for users unfamiliar with configuration customization. We'll outline several different methods below.

### Meat and Potatoes

Consider the following `webpack` configurations, before and after adding the `webpack-plugin-serve` client entry:

#### A single `String` entry

```js
// before
module.exports = {
  entry: 'dist/bundle.js'
};
```

```js
// after
module.exports = {
  entry: ['dist/bundle.js', 'webpack-plugin-serve/client']
};
```

#### An `Array` of `String` entry

```js
// before
module.exports = {
  entry: [
    'dist/bundle.js',
    'dist/worker.js'
  ]
};
```

```js
// after
module.exports = {
  entry: [
    'dist/bundle.js',
    'dist/worker.js',
    'webpack-plugin-serve/client'
  ]
};
```

#### An `Object` of defining a single `String` entry

```js
// before
module.exports = {
  entry: {
    main: 'dist/bundle.js'
  }
};
```

```js
// after
module.exports = {
  entry: {
    main: ['dist/bundle.js', 'webpack-plugin-serve/client']
  }
};
```

#### An `Object` of defining multiple `String` entries

If there are multiple entry points defined for your bundle, and you'd like each entry point to support features like Hot Module Reloading, the `webpack-plugin-serve` client script must be added to each:

```js
// before
module.exports = {
  entry: {
    main: 'dist/bundle.js',
    worker: 'dist/worker.js'
  }
};
```

```js
// after
module.exports = {
  entry: {
    main: ['dist/bundle.js', 'webpack-plugin-serve/client'],
    worker: ['dist/worker.js', 'webpack-plugin-serve/client']
  }
};
```

### 🍰 Dessert

The examples above outline how the `webpack-plugin-serve/client` script can be added to several common `entry` patterns. The important bit is that the value, whether it be a single entry point or an `Object` with properties, be transformed into an array which includes an item with the `webpack-plugin-serve` client script. Cheers, and good eating.
